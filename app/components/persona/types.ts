export type Persona = {
  full_name: string;
  title: string;
  company: string;
  phone: string;
  about: string;
};

export const EMPTY_PERSONA: Persona = {
  full_name: "",
  title: "",
  company: "",
  phone: "",
  about: "",
};

export const PERSONA_FIELDS: {
  key: keyof Persona;
  label: string;
  placeholder: string;
}[] = [
  { key: "full_name", label: "Full name", placeholder: "Dale Steyn" },
  { key: "title", label: "Job title", placeholder: "Product Lead" },
  { key: "company", label: "Company", placeholder: "PROTEAS" },
  { key: "phone", label: "Phone", placeholder: "(555) 010-4432" },
  {
    key: "about",
    label: "About you",
    placeholder: "Tell the agent who you are, your context",
  },
];