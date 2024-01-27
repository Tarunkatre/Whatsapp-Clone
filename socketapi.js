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
        
        if(!reqUser){
            const group = await GroupModel.findById(msg.reciever).populate('members')

            if(!group) return;
            
        }

        await messageModel.create({
            message: msg.message,
            reciever: msg.reciever,
            sender: msg.sender
        })

        if(reqUser)
        socket.to(reqUser.socketId).emit('golu', msg);
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
        
        const allGroup = await GroupModel.find({
            members: {
                $in: [
                    currentUser._id
                ]
            }
        })

        allGroup.forEach(group => {
            socket.emit('allGroup',{
                img: group.picture,
                name: group.groupName,
                message: 'hello!',
                id: group._id
            })
        })


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
        const adminDetails = await UserModel.findOne({
            _id: details.currentUserid
        })
        await newGroup.save()

        socket.emit('groupCreated',{
            groupDetails: newGroup,
            admin : adminDetails
        })
    })

    socket.on('addGroup',async (details)=>{
        const Group = await GroupModel.findOne({
            groupName: details.groupName,
        })

        const user = await UserModel.findOne({
            _id:details.currentUserid
        })
        
        Group.members.push(user._id)
        await Group.save()

        socket.emit('groupCreated', {
            groupDetails: Group,
            admin: user
        })
    })
    
});
// end of socket.io logic

module.exports = socketapi;