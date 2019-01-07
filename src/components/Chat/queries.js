import gql from 'graphql-tag'

export const ROOMS = gql`
  {
    rooms {
      id
      name
      userCount
    }
  }
`

export const CHAT = gql`
  {
    chat {
      rooms {
        id
        name
        unread
        isLastRoom
      }
      user {
        id
        lastroomId
      }
      users {
        id
        online
        name
        username
      }
    }
  }
`

export const CREATE_ROOM = gql`
  mutation createRoom($input: RoomInput) {
    createRoom(input: $input) {
      id
      name
      description
    }
  }
`

export const DIRECT_MESSAGE_ROOM = gql`
  mutation directMessageRoom($input: DirectUserInput) {
    directMessageRoom(input: $input) {
      id
    }
  }
`

export const JOIN_ROOM = gql`
  mutation joinRoom($input: RoomIdInput) {
    joinRoom(input: $input) {
      id
      name
      description
    }
  }
`

export const ROOM_INFO = gql`
  query roomInfo($input: RoomIdInput) {
    roomInfo(input: $input) {
      id
      name
      isEditable
      isPrivate
      description
      users {
        id
        online
        name
        username
      }
      messages {
        id
        content
        userId
        createdAt
      }
    }
  }
`

export const CREATE_MESSAGE = gql`
  mutation newMessage($input: MessageInput) {
    newMessage(input: $input) {
      id
      content
      userId
      createdAt
    }
  }
`

export const DESTROY_ROOM = gql`
  mutation destroyRoom($input: RoomIdInput) {
    destroyRoom(input: $input) {
      id
    }
  }
`

export const LEAVE_ROOM = gql`
  mutation leaveRoom($input: RoomIdInput) {
    leaveRoom(input: $input) {
      id
    }
  }
`

export const EDIT_ROOM = gql`
  mutation editRoom($input: RoomInput) {
    editRoom(input: $input) {
      id
    }
  }
`

export const CHAT_MODAL = gql`
  {
    chatModal @client
  }
`

export const CHAT_ERROR = gql`
  {
    chatError @client
  }
`
