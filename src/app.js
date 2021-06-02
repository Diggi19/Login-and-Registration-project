// setups
const express =require('express')
const app = express()
const path = require('path')
require('./db/connect')
const Register = require('./models/Users')


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

const name = 'digvesh' 
app.get('/show',async(req,res)=>{
    const data = await Register.find({firstname:name})
    const singled = data.find((user)=>user.firstname === name)
    console.log(data);
    console.log(singled);
})

//handeling registration
app.post('/register',async(req,res)=>{
    try {
    
        const password = req.body.password
        const confirmpassword = req.body.confirmpassword
        const user = new Register({
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            email:req.body.email,
            phone:req.body.phone,
            gender:req.body.gender,
            password:req.body.password,
            confirmpassword:req.body.confirmpassword,
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
        if (password === singled.password) {
            res.render('profile')
        }else{
            res.redirect('login',[{name:singled.firstname}])
        }
    }else{
        res.send("login info is incorrect")
    }


})


app.listen(3000,()=>{
    console.log('listening..');
})