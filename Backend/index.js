const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const { error } = require('console');

const app = express();
app.use(cors());
app.use(express.json()); // Middleware 



// mongoDB connection 
const mongodburl = "mongodb://127.0.0.1:27017/User";

mongoose.connect(mongodburl)
    .then(() => console.log('MongoDB is connected successfully'))
    .catch(err => console.log('MongoDB connection failed:', err));

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    number: { type: String, required: true },
    email: { type: String, required: true},
    password: { type: String, required: true },
    companyname: { type: String, required: true }, // Updated field name
    companyid: { type: String, required: true }
});

// Model 
const signupModel = mongoose.model('signupModel', userSchema);

// Save API
app.post("/users/post", async (req, res) => {
    const { username, email, number, password, companyname, companyid } = req.body;

    try {
        if (!username || !email || !number || !password || !companyname || !companyid) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newuser = new signupModel({
            username,
            email,
            number,
            password,
            companyname,
            companyid,
        });

        await newuser.save();
        res.status(201).json({ message: "Signup successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error saving user", error: err.message });
    }
});


// Get API
app.get("/users/get", async (req, res) => {
    try {
        const users = await signupModel.find();
        res.status(200).json({ message: 'Users retrieved successfully', users });
    } catch (err) {
        res.status(400).json({ message: 'Error retrieving users', error: err.message });
    }
});

// Delete API
app.delete("/users/:id", async (req, res) => {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid User ID" });
    }

    try {
        const user = await signupModel.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting User', error: error.message });
    }
});

// Login API
app.post("/users/login", async (req, res) => {
    
    try {
        const { email, password } = req.body;

        const user = await signupModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User does not exist" });
        }

        if (user.password === password) {
            return res.status(201).json({ message: "Login successful", user });
        } else {
            return res.status(401).json({ message: "Invalid password" });
        }
        
    } catch (err) {
        res.status(500).json({ message: "Error logging in", error: err.message });
    }
});



// Edit API
app.put("/users/edit/:id", async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid User ID" });
    }

    try {
        const user = await signupModel.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (err) {
        res.status(400).json({ message: 'Error updating User', error: err.message });
    }
});

// *************  Product kliye Schema **************

const productSchema = new mongoose.Schema({
    productname: { type: String, required: true },
    price: { type: String, required: true },
    quantity: { type: String, required: true},
    date: { type: String, required: true},
    productImage: { type: String, required: true } // Corrected field name
    
});

// Product Model 


const Product = mongoose.model("Product", productSchema);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configer Multer for Image uploads

// uploads folder ka path
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}
// multer Storage setup 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
  });

  const upload = multer({ storage });

// server uploaded image statically



// Product ka Data save ki Api

app.post("/products/post", upload.single("productImage"), async (req, res) => {
    const { productname, price, quantity, date } = req.body;
    const productImage = req.file ? `http://localhost:3000/uploads/${req.file.filename}` : "";
    try {
        if (!productname || !price || !quantity || !date || !productImage) {
          return res.status(400).json({ message: "All fields are required" });
        }
        const newProduct = new Product({
            productname,
            price,
            quantity,
            date,
            productImage,
          });
          await newProduct.save();
          console.log("Product saved successfully:", newProduct); // Debugging
          res.status(201).json({ message: "Product saved successfully" });
        } catch (err) {
          console.error("Error saving product:", err); // Debugging
          res.status(500).json({ message: "Error saving product", error: err.message });
        }
      });

// Get API

app.get("/products/get", async (req, res) => {
    try {
      const products = await Product.find();
      console.log("Fetched products from DB:", products); // Debugging
      res.status(200).json({ message: "Products fetched successfully", products });
    } catch (err) {
      console.error("Error fetching products:", err); // Debugging
      res.status(500).json({ message: "Error fetching products", error: err.message });
    }
  });

// Product Edit ki Api

app.put("/products/edit/:id", upload.single("productImage"), async (req, res )=>{
    const{id}= req.params;
    // Check if the id is vailid
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({message: 'Invailied Product Id'})
    }
    try {
        const product= await Product.findByIdAndUpdate(id, req.body, {new: true});
        if(!product){
            
            return res.status(404).json ({message: 'Product note found'});
        }
        res.status(200).json({message: 'product Updated successfully', product });
    } catch (err) {
        res.status(400).json({message: 'Error updating Product', error: err.message});
        
    }
});

// product k Data ko Delete ki Api 

app.delete("/products/delete/:id", async (req, res )=>{
   
    try {
        const {id} = req.params;
        console.log("Delete Request ID:", id); // Debugging ke liye
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
          }
        const product = await Product.findByIdAndDelete(id);
        if(!product){
            return res.status(404).json({message: 'Product not found'});
        }
        res.status(200).json({message: 'Product Deleted Successfully'});
    } catch (err) {
        console.error("Error deleting product:", err); // Debugging ke liye
        res.status(500).json({message: 'Error Deleting Product', error: err.message});
    }
});


// ******** Client ka Schema *********


const clientSchema = new mongoose.Schema({
         
    clientName:{ type:String, required:true },
    number: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    status: { type: String, required: true },
    qualification: { type: String, required: true },
    clientImage: { type: String, required: true },

});

// Client Model  

const Client = mongoose.model("Client", clientSchema);

// Api of client data save 

app.post("/clients/post", async(req, res) =>{
    
    const {clientname, email, number, qualification, status, password,} =req.body;
    const clientImage = req.file ? `http://localhost:3000/uploads/${req.file.filename}` : "";
    try {
        if(!clientname || !email || !number || !qualification || !status || password || clientImage) {
            return res.status(400).json({message: 'All fields are required'});
        }
        const newClient = new Client({
            clientname,
            email,
            number,
            qualification,
            status,
            password,
            clientImage,
        });
        await newClient.save();
        console.log("Client save successfully:", newClient);   // Debugging k liye
        res.status(201).json({message:"Client saved successfully"});
    } catch (err) {
        console.error("Error saving Client", err);   // Debugging k liye
        res.status(500).json({message:"Error saving product", error: err.message });
        
    }
    
});

// Clients Get Api 


app.get("/client/get", async(req, res) =>{
    try {
        const client = await Client.find();
        console.log("Fetched clients from DB:", client);   // Debugging k liye
        res.status(200).json({message:"Clients fetched successfully", client});
        
    } catch (err) {
        res.status(500).json({message:"Error fetching product", error: err.message});
    }
});
   
// Api of client data edit

app.put("client/edit/:id", async(req, res) =>{
    const {id}= req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({message:"Invailid Client Id "});
        
    }
    try {
        const client = await Client.findByIdAndUpdate(id, req.body, {new: true});
        if(!client){
            return res.status(404).json ({message:"Client note found"});
        }
        res.status(200).json ({message:"client Updated successfully", client});
    } catch (error) {
        res.status(400).json({message:"Error Updating Product", error: err.message});
        
    }
});


// Api of Client data delete


app.delete("/client/delete/:id", async (req,res) =>{
    try {
        const {id} = req.params;
        console.log("Delete request ID:", id);   // Debugging k liye
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message:"Invailied client ID"});   
        }
        const client = await Client.findByIdAndDelete(id);
        if(!client){
            return res.status(404).json({message:"Product not found"});
        }
        res.status(200).json({message:"Client Deleted successfully"});
    } catch (err) {
        console.error("Error deleting Client:", err);  // Debugging k liye
        res.status(500).json({message:"Error Deleting Client", err});
    }
})


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`App is running on https://localhost:${PORT}`);
});
