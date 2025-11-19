var express=require('express')
var bodyParser=require('body-parser')
var path=require('path')
const mongoose=require('mongoose')

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('./Web'))

const conect=mongoose.connection
mongoose.connect('mongodb+srv://Jaeger666_:paul1234@cluster0.qo6laex.mongodb.net/miapp')
conect.once('open',()=>{
    console.log("Conexion Exitosa")
})
conect.on('error',(error)=>{
    console.log("Error de conexion con la base de datos")
})

const UsuariosSchema=new mongoose.Schema({
    Usuario:String,
    Correo:String,
    Telefono:Number,
    Contra:String,
    Rol:String
})

const Usuarios=mongoose.model('Usuarios',UsuariosSchema)

app.post('/crear',async(req,res)=>{
    try{
        const nuevoUsuario=new Usuarios({
            Usuario:req.body.Usuario,
            Correo:req.body.Correo,
            Telefono:req.body.Telefono,
            Contra:req.body.Contra,
            Rol:req.body.Rol
        })
        await nuevoUsuario.save()
        res.status(201).send("Usuario Registrado")
    }
    catch(error){
        console.error(error)
        res.status(500).send("Error: " + error.message);
    }
})

app.post('/login', async (req, res) => {
    try {
        const { Correo, Contra } = req.body;

        if (!Correo || !Contra) {
            return res.status(400).send("Correo y Contraseña son requeridos.");
        }

        const usuarioEncontrado = await Usuarios.findOne({ Correo: Correo });

        if (!usuarioEncontrado) {
            return res.status(401).send("Correo no encontrado.");
        }

        res.status(200).json({
            message: "Inicio de sesión exitoso",
            user: {
                id: usuarioEncontrado._id,
                Correo: usuarioEncontrado.Correo,
                Contra: usuarioEncontrado.Contra,
                Rol: usuarioEncontrado.Rol
            }
        });

    } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        res.status(500).send("Error interno del servidor durante el login.");
    }
});

/*app.get('/leer',async(req,res)=>{
    try{
        const usuarios= await Usuarios.find()
        res.json(usuarios)
    }
     catch(error){
        console.error(error)
        res.status(500).send("Error Leer: ", error)
    }
})

 app.put('/actualizar/:id',async(req,res)=>{
    try{
        const {id}=req.params
        const PA=await Productos.findByIdAndUpdate(
            id,{
                prod:req.body.prod,
                cant:req.body.cant,
                precio:req.body.precio,
                fecha:req.body.fecha,
                dir:req.body.dir
                },
            {new:true}    
        )
        if(!PA){
            return res.status(404).send("Producto no encontrado")
        }
        else{
            res.status(201).send("Producto Actualizado")
        }
    }
    catch(error){
        console.error(error)
        res.status(500).send("Error Leer: ", error)
    }
})

app.delete('/eliminar/:id',async(req,res)=>{
    try{
        const {id}=req.params
        const PE= await Productos.findByIdAndDelete(id);
        if(!PE){
            return res.status(404).send("Producto no encontrado")
        }
        else{
            res.status(201).send("Producto eliminado")
        }
    }
    catch(error){
        console.error(error)
        res.status(500).send("Error Leer: ", error)
    }
}) */

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor Express ejecutándose en el puerto: ${PORT}`);
});