const typeDefs = `
scalar Long

type Query {
  rooms: [Room]
  roomInfo(input: RoomIdInput): Room
  searchItem(
    userId: Int,
    searchTerm: String
    ): [Message]
  chat: Chat
}

type Mutation {
  destroyRoom(input: RoomIdInput): Room
  leaveRoom(input: RoomIdInput): Room
  deletePost(messageId: Int, roomId: Int): GENERICSUCCESS
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
  messageId: Int
}

type Room { 
  id: String 
  name: String 
  description: String
  isEditable: Boolean
  isPrivate: Boolean
  unread: Int
  userCount: Int
  isLastRoom: Boolean
  is_editable: Boolean
  is_private: Boolean
  users: [User]
  messages: [Message]
}

input DirectUserInput { 
  id: Int
  username: String 
}

input RoomInput { 
  id: Int
  name: String 
  description: String
  isEditable: Boolean
  isPrivate: Boolean
}

input MessageInput { 
  content: String 
  tmpId: String 
  roomId: Int
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
  id: Int
  name: String
  username: String
  time: Long
  online: Boolean
  is_active: Boolean
  lastroomId: Int
  last_room: Int
}

type GENERICRESPONSE {
  success: Boolean
  id: Int
  error: String
}

type GENERICSUCCESS {
  success: Boolean 
}

type DeleteUser {
  id: Int
}

type Message {
  id: Int
  room_name: String
  room_id: Int
  user_id: Int
  content: String
  userId: Int
  createdAt: String
  updatedAt: String
  isEdited: Boolean
  edited_time: Long
}

type UserRoom {
  room_test_id: Int
  user_test_id: Int
}`

module.exports = typeDefs
