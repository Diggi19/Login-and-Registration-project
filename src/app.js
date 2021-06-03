// setups
const express =require('express')
const app = express()
const path = require('path')
require('./db/connect')
const Register = require('./models/Users')
const bcrypt = require('bcrypt')

// paths
const static_path = path.join(__dirname,"public")
const template_view_path =  path.join(__dirname,"templates/view")
const template_partials_path = path.join(__dirname,"template/partials")
//middlewares
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(express.static(static_path))

//template engine setup
app.set('view engine', 'ejs')
app.set('views', template_view_path)
app.set('partials',template_partials_path)


// setting up pages 
app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/register',(req,res)=>{
    res.render('register')
})

app.get('/login',(req,res)=>{
    res.render('login')
})
app.get('/profile',(req,res)=>{
    res.render('profile')
})
const name = 'digvesh' 


//handeling registration
app.post('/register',async(req,res)=>{
    try {
    
        const password = req.body.password
        const hashpassword = await bcrypt.hash(password,10)
        const confirmpassword = req.body.confirmpassword
        const hashconfirmpassword = await bcrypt.hash(confirmpassword,10)

        const user = new Register({
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            email:req.body.email,
            phone:req.body.phone,
            gender:req.body.gender,
            password:hashpassword,
            confirmpassword:hashconfirmpassword,
        })
        if (password === confirmpassword) {
            const result = await user.save()             
        }else{
            res.redirect('/register')
            
        }
        res.redirect('/login')
    } catch (e) {
        console.log(e);
        res.status(500).send("error")
    }

})

// handeling login 
app.post('/login',async(req,res)=>{
     //getting data from page
    const{email,password}=req.body
    
    //getting data from db
    const data = await Register.find({email:email})
    const singled = data.find((user)=>user.email === email)

    if (singled) {
        const check = await bcrypt.compare(password,singled.password)
        if (check) {
            res.redirect('/profile')
        }else{
            res.redirect('/login')
        }
    }else{
        res.send("login info is incorrect")
    }


})


app.listen(3000,()=>{
    console.log('listening..');
})