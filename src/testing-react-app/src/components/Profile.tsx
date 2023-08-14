import axios from "axios";
import React, { useEffect, useState } from "react";

interface CoffeeProps {
    name: string;
}

export const Coffee = ({ name }: CoffeeProps): React.ReactNode => {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [choice, setChoice] = useState<string>('1');

    const fetchApiData = async (choice_: string) => {
        const apiEndpoint: string = `https://api.sampleapis.com/coffee/hot/${choice_}`;
        const response = await axios.get(apiEndpoint);
        const data = await response.data

        return data
    }

    useEffect(() => {
        // Build endpoint using choice value
        fetchApiData(choice).then(data => {
            const title_: string = data['title'] || '';
            const description_: string = data['description'] || '';

            setTitle(title_);
            setDescription(description_);
        }).catch(error => console.log(error));

    }, [choice]);

    const buttonsForChoices = ['1','2','3','4','5'].map((choice_: string, index_: number) => {
        return (
            <button key={index_} onClick={() => setChoice(choice_)}>
                {choice_}
            </button>
        );   
    });

    return (
        <>
            <h1>{title}</h1>
            <h2>{`- ${name}`}</h2>
            <p>{description}</p>
            {buttonsForChoices}
        </>
    );
}