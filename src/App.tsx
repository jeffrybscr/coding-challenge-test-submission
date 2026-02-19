import React from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import InputText from "@/components/InputText/InputText";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import useAddressBook from "@/hooks/useAddressBook";
import useFormFields from "./ui/hooks/useFormFields";
import transformAddress, { RawAddressModel } from "./core/models/address";

import styles from "./App.module.css";
import { Address as AddressType } from "./types";

interface FormFields {
  [key: string]: string;
  postCode: string;
  houseNumber: string;
  firstName: string;
  lastName: string;
  selectedAddress: string;
}

function App() {
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

  const [error, setError] = React.useState<undefined | string>(undefined);
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  /**
   * Redux actions
   */
  const { addAddress } = useAddressBook();

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

  const handlePersonSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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

    setFormFields((prev: FormFields) => ({
      ...prev,
      firstName: "",
      lastName: "",
      selectedAddress: "",
    }));
    setAddresses([]);
    setError(undefined);
  };

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

        <ErrorMessage message={error || ""} />

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
