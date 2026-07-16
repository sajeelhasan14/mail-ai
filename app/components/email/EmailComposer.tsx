"use client"
import { useState } from "react"
import EmailForm from "./EmailForm";

export default function EmailComposer() {
    const [description, setDescription] = useState("");

    async function handleGenerate() {
    
}
    return (
        <EmailForm
            value={description}
            onChange={setDescription }
            onSubmit={ handleGenerate}
            loading
        />
    )
}