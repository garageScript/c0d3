const typeDefs = `
scalar Long

type Query {
  rooms: [Room]
  roomInfo(input: RoomIdInput): Room
  searchItem(
    userId: String,
    searchTerm: String
    ): [Message]
  chat: Chat
}

type Mutation {
  destroyRoom(input: RoomIdInput): Room
  leaveRoom(input: RoomIdInput): Room
  deletePost(messageId: String, roomId: String): GENERICSUCCESS
  editMessage(input: MsgEditInfo): GENERICSUCCESS
  createRoom(input: RoomInput): Room
  editRoom(input: RoomInput): Room
  directMessageRoom(input: DirectUserInput): Room
  joinRoom(input: RoomIdInput): Room
  newMessage(input: MessageInput): Message
}

input MsgEditInfo {
  content: String
  editedTime: Long
  messageId: String
}

type Room { 
  id: String 
  name: String 
  description: String
  isEditable: Boolean
  isPrivate: Boolean
  unread: String
  userCount: String
  isLastRoom: Boolean
  is_editable: Boolean
  is_private: Boolean
  users: [User]
  messages: [Message]
}

input DirectUserInput { 
  id: String
  username: String 
}

input RoomInput { 
  id: String
  name: String 
  description: String
  isEditable: Boolean
  isPrivate: Boolean
}

input MessageInput { 
  content: String 
  tmpId: String 
  roomId: String
}

input RoomIdInput { 
  id: String
}

type Chat { 
  user: User
  rooms: [Room]
  users: [User]
}

type User {
  id: String
  name: String
  username: String
  time: Long
  online: Boolean
  is_active: Boolean
  lastroomId: String
  last_room: String
}

type GENERICRESPONSE {
  success: Boolean
  id: String
  error: String
}

type GENERICSUCCESS {
  success: Boolean 
}

type DeleteUser {
  id: String
}

type Message {
  id: String
  room_name: String
  room_id: String
  user_id: String
  content: String
  userId: String
  createdAt: Long 
  updatedAt: Long
  isEdited: Boolean
  edited_time: Long
}

type UserRoom {
  room_test_id: String
  user_test_id: String
}`

module.exports = typeDefs
