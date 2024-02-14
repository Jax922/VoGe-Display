async function parse(text) {
    try {
        const response = await fetch('http://0.0.0.0:5005/model/parse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ text: text })
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log(data);
        return data; 
      } catch (error) {
        console.error("There was an error!", error);
    }
}

export default {
    parse
};


