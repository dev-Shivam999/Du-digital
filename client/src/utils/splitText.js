const splitText = (text = "") => {
    // Match " – " OR " - "
    const separatorRegex = /\s[–-]\s/;
    const match = text.match(separatorRegex);

    if (!match) {
        return {
            title: text.trim(),
            description: "",
        };
    }

    const index = match.index;

    return {
        title: text.slice(0, index).trim(),
        description: text.slice(index + match[0].length).trim(),
    };
};

export default splitText;





// const splitText = (text) => {
//     const index = text.indexOf(" - ");
//     if (index === -1) return { title: text, description: "" };

//     return {
//         title: text.slice(0, index),
//         description: text.slice(index + 3),
//     };
// };

// export default splitText;
