const jsonDataArray = [];

for (let i = 0; i < 5; i++) {
    const dynamicData = {
        name: `Person ${i + 1}`,
        age: Math.floor(Math.random() * 50) + 1,
        city: "Some City",
        hobbies: ["hobby1", "hobby2", "hobby3"],
    };
    jsonDataArray.push(dynamicData);
}

console.log(JSON.stringify(jsonDataArray));