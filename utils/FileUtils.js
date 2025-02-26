export function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        // Triggered when the file is successfully read
        reader.onload = () => {
            resolve(reader.result.split(",")[1]); // Extract the Base64 content
        };

        // Triggered if there’s an error reading the file
        reader.onerror = () => {
            reject(new Error("Error reading file."));
        };

        // Read the file as a Base64 string
        reader.readAsDataURL(file);
    });
}