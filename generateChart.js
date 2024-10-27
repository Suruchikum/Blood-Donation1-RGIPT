// const fs = require('fs');
// const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

// const width = 800; 
// const height = 600; 
// const backgroundColour = 'white'; 
// const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour });


// const configuration = {
//     type: 'pie',   
//     data: {
//         labels: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], 
//         datasets: [{
//             label: 'Blood Type Distribution',
//             data: [30, 15, 25, 10, 5, 10, 20, 15], 
//             backgroundColor: [
//                 'rgb(255, 99, 132)',
//                 'rgb(255, 159, 64)',
//                 'rgb(255, 205, 86)',
//                 'rgb(75, 192, 192)',
//                 'rgb(54, 162, 235)',
//                 'rgb(153, 102, 255)',
//                 'rgb(201, 203, 207)',
//                 'rgb(255, 99, 132)'
//             ],
//             borderColor: [
//                 'rgb(255, 99, 132)',
//                 'rgb(255, 159, 64)',
//                 'rgb(255, 205, 86)',
//                 'rgb(75, 192, 192)',
//                 'rgb(54, 162, 235)',
//                 'rgb(153, 102, 255)',
//                 'rgb(201, 203, 207)',
//                 'rgb(255, 99, 132)'
//             ],
//             borderWidth: 1
//         }],
//     },
//     options: {
//         responsive: true,
//         plugins: {
//             legend: {
//                 position: 'top',
//             },
//             tooltip: {
//                 callbacks: {
//                     label: function(tooltipItem) {
//                         return tooltipItem.label + ': ' + tooltipItem.raw + '%'; 
//                     }
//                 }
//             }
//         }
//     }
// }

// async function run() {
//     try {
        
//         const dataUrl = await chartJSNodeCanvas.renderToDataURL(configuration);

        
//         console.log("Generated Data URL:", dataUrl);

        
//         const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");

        
//         fs.writeFile("blood-type-distribution.png", base64Data, 'base64', (err) => {
//             if (err) {
//                 console.error("Error writing file:", err);
//             } else {
//                 console.log("File successfully written.");
//             }
//         });

//     } catch (error) {
//         console.error("Error in run function:", error);
//     }
// }

// run();
const fs = require('fs');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const mongoose = require('mongoose');

const width = 800; // px
const height = 600; // px
const backgroundColour = 'white'; // Background color
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour });

// Configuration for blood type distribution chart
const configuration = {
    type: 'pie',
    data: {
        labels: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Blood types
        datasets: [{
            label: 'Blood Type Distribution',
            data: [30, 15, 25, 10, 5, 10, 20, 15], // Example data for blood type distribution
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)',
                'rgb(255, 99, 132)'
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)',
                'rgb(255, 99, 132)'
            ],
            borderWidth: 1
        }],
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return tooltipItem.label + ': ' + tooltipItem.raw + '%'; // Show percentage
                    }
                }
            }
        }
    }
};

// Define MongoDB schema and model for saving images
const imageSchema = new mongoose.Schema({
    name: String,
    data: Buffer,
    contentType: String
});
const ImageModel = mongoose.model('Image', imageSchema);

async function run() {
    try {
        // Generate the chart
        console.log("Generating chart...");
        const dataUrl = await chartJSNodeCanvas.renderToDataURL(configuration);
        console.log("Generated Data URL");

        // Extract the base64 data
        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");

        // Convert base64 to binary Buffer
        const imageBuffer = Buffer.from(base64Data, 'base64');

        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/blooddonationrgipt', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Save the image in MongoDB
        const newImage = new ImageModel({
            name: 'Blood Type Distribution Chart',
            data: imageBuffer,
            contentType: 'image/png'
        });

        await newImage.save();
        console.log('Image saved to MongoDB');

        // Optionally, write the file locally too
        fs.writeFile("blood-type-distribution.png", base64Data, 'base64', (err) => {
            if (err) {
                console.error("Error writing file:", err);
            } else {
                console.log("File successfully written.");
            }
        });

    } catch (error) {
        console.error("Error in run function:", error);
    } finally {
        // Close the MongoDB connection
        await mongoose.connection.close();
        console.log("MongoDB connection closed");
    }
}

run();
