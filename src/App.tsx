import React from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import InputText from "@/components/InputText/InputText";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import useAddressBook from "@/hooks/useAddressBook";
// done: added imports for custom hook and transformAddress
import useFormFields from "./ui/hooks/useFormFields";
import transformAddress, { RawAddressModel } from "./core/models/address";

import styles from "./App.module.css";
import { Address as AddressType } from "./types";

// done: defined form fields interface for the hook
interface FormFields {
  [key: string]: string;
  postCode: string;
  houseNumber: string;
  firstName: string;
  lastName: string;
  selectedAddress: string;
}

function App() {
  /**
   * Form fields states
   * TODO: Write a custom hook to set form fields in a more generic way:
   * - Hook must expose an onChange handler to be used by all <InputText /> and <Radio /> components
   * - Hook must expose all text form field values, like so: { postCode: '', houseNumber, '', ...etc }
   * - Remove all individual React.useState
   * - Remove all individual onChange handlers, like handlePostCodeChange for example
   * - done: created useFormFields hook and using it below
   */
  const {
    values: formFields,
    handleChange,
    resetFields,
    setValues: setFormFields,
  } = useFormFields<FormFields>({
    postCode: "",
    houseNumber: "",
    firstName: "",
    lastName: "",
    selectedAddress: "",
  });

  /**
   * Results states
   */
  const [error, setError] = React.useState<undefined | string>(undefined);
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  /**
   * Redux actions
   */
  const { addAddress } = useAddressBook();

  /** TODO: Fetch addresses based on houseNumber and postCode using the local BE api
   * - Example URL of API: ${process.env.NEXT_PUBLIC_URL}/api/getAddresses?postcode=1345&streetnumber=350
   * - Ensure you provide a BASE URL for api endpoint for grading purposes!
   * - Handle errors if they occur
   * - Handle successful response by updating the `addresses` in the state using `setAddresses`
   * - Make sure to add the houseNumber to each found address in the response using `transformAddress()` function
   * - Ensure to clear previous search results on each click
   * - Bonus: Add a loading state in the UI while fetching addresses
   * - done: implemented api fetch with error handling and loading state
   */
  const handleAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);
    setAddresses([]);
    setIsLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_URL || "";
      const response = await fetch(
        `${baseUrl}/api/getAddresses?postcode=${formFields.postCode}&streetnumber=${formFields.houseNumber}`
      );

      const data = await response.json();

      if (data.status === "error") {
        setError(data.errormessage || "Failed to fetch addresses");
        return;
      }

      if (data.details && Array.isArray(data.details)) {
        const transformedAddresses = data.details.map((addr: RawAddressModel) =>
          transformAddress({
            ...addr,
            houseNumber: formFields.houseNumber,
          })
        );
        setAddresses(transformedAddresses);
      }
    } catch (err) {
      setError("Failed to fetch addresses. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /** TODO: Add basic validation to ensure first name and last name fields aren't empty
   * Use the following error message setError("First name and last name fields mandatory!")
   * - done: added validation check before adding address
   */
  const handlePersonSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // done: added first/last name validation
    if (!formFields.firstName.trim() || !formFields.lastName.trim()) {
      setError("First name and last name fields mandatory!");
      return;
    }

    if (!formFields.selectedAddress || !addresses.length) {
      setError(
        "No address selected, try to select an address or find one if you haven't"
      );
      return;
    }

    const foundAddress = addresses.find(
      (address: AddressType) => address.id === formFields.selectedAddress
    );

    if (!foundAddress) {
      setError("Selected address not found");
      return;
    }

    addAddress({
      ...foundAddress,
      firstName: formFields.firstName,
      lastName: formFields.lastName,
    });

    // done: reset form after adding
    setFormFields((prev: FormFields) => ({
      ...prev,
      firstName: "",
      lastName: "",
      selectedAddress: "",
    }));
    setAddresses([]);
    setError(undefined);
  };

  // done: added clear all fields handler
  const handleClearFields = () => {
    resetFields();
    setAddresses([]);
    setError(undefined);
  };

  return (
    <main>
      <Section>
        <h1>
          Create your own address book!
          <br />
          <small>
            Enter an address by postcode add personal info and done! 👏
          </small>
        </h1>
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        <form onSubmit={handleAddressSubmit}>
          <fieldset>
            <legend>🏠 Find an address</legend>
            <div className={styles.formRow}>
              <InputText
                name="postCode"
                onChange={handleChange}
                placeholder="Post Code"
                value={formFields.postCode}
              />
            </div>
            <div className={styles.formRow}>
              <InputText
                name="houseNumber"
                onChange={handleChange}
                value={formFields.houseNumber}
                placeholder="House number"
              />
            </div>
            <Button type="submit" loading={isLoading}>
              Find
            </Button>
          </fieldset>
        </form>
        {addresses.length > 0 &&
          addresses.map((address: AddressType) => {
            return (
              <Radio
                name="selectedAddress"
                id={address.id}
                key={address.id}
                onChange={handleChange}
              >
                <Address {...address} />
              </Radio>
            );
          })}
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        {formFields.selectedAddress && (
          <form onSubmit={handlePersonSubmit}>
            <fieldset>
              <legend>✏️ Add personal info to address</legend>
              <div className={styles.formRow}>
                <InputText
                  name="firstName"
                  placeholder="First name"
                  onChange={handleChange}
                  value={formFields.firstName}
                />
              </div>
              <div className={styles.formRow}>
                <InputText
                  name="lastName"
                  placeholder="Last name"
                  onChange={handleChange}
                  value={formFields.lastName}
                />
              </div>
              <Button type="submit">Add to addressbook</Button>
            </fieldset>
          </form>
        )}

        {/* TODO: Create an <ErrorMessage /> component for displaying an error message - done: using ErrorMessage component */}
        <ErrorMessage message={error || ""} />

        {/* TODO: Add a button to clear all form fields.
        Button must look different from the default primary button, see design.
        Button text name must be "Clear all fields"
        On Click, it must clear all form fields, remove all search results and clear all prior
        error messages
        - done: added secondary button with handleClearFields
        */}
        <Button variant="secondary" onClick={handleClearFields}>
          Clear all fields
        </Button>
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
