const io = require("socket.io")();
const UserModel = require("./routes/users")
const GroupModel = require("./routes/group")
const messageModel = require('./routes/message')
const socketapi = {
    io: io
};

// Add your socket.io logic here!
io.on("connection", function (socket) {

    socket.on("message", async function(msg){
        const reqUser = await UserModel.findById(msg.reciever)
        
        await messageModel.create({
            message: msg.message,
            reciever: msg.reciever,
            sender: msg.sender
        })

        io.to(reqUser.socketId).emit('golu', msg);
    })

    socket.on('chatdetails',async msgObject=>{
        const allMessages = await messageModel.find({
            $or:[
                {
                    sender: msgObject.firstUser, /* a */
                    reciever: msgObject.secondUser    /* b */
                },
                {
                    sender: msgObject.secondUser, /* b */
                    reciever: msgObject.firstUser     /* a */
                }
            ]
        })
        socket.emit('chatdetails',allMessages)
    })
    
    socket.on("server", async function(username){
        const currentUser = await UserModel.findOne({username:username});
        currentUser.socketId = socket.id;
        await currentUser.save();
        
        const presentusers = await UserModel.find({
            socketId:{
                $nin: ['']
            },
            username:{
                $nin:[currentUser.username]
            }
        })
        presentusers.forEach(user =>{
            socket.emit('onlineUser',{
                img: user.picture,
                name: user.username,
                message: 'hello!',
                id: user._id,
            })
        })

        socket.broadcast.emit('onlineUser',{
            img: currentUser.picture,
            name: currentUser.username,
            message: 'hello!',
            id:currentUser._id
        });
    })

    socket.on('disconnect',async ()=>{
        await UserModel.findOneAndUpdate({socketId:socket.id},{socketId:''})
    })

    socket.on('createGroup',async (details)=>{
        const newGroup = await GroupModel.create({
            groupName: details.groupName,
        })
        newGroup.members.push(details.currentUserid)
        await newGroup.save()
    })
    
    
});
// end of socket.io logic

module.exports = socketapi;