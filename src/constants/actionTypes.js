export const SET_INITIAL_DATA_LOADING = 'SET_INITIAL_DATA_LOADING'
export const REQUEST_ORG_DATA = 'REQUEST_ORG_DATA'
export const REQUEST_USER_PROFILE = 'REQUEST_USER_PROFILE'
export const REQUEST_USERS = 'REQUEST_USERS'
export const REQUEST_CHANNEL_AND_USERS = 'REQUEST_CHANNEL_AND_USERS'
export const REQUEST_JOIN_ORG = 'REQUEST_JOIN_ORG'
export const SET_SETTINGS = 'SET_SETTINGS'
export const SET_ORGANIZATIONS = 'SET_ORGANIZATIONS'
export const SET_ORG = 'SET_ORG'
export const SET_USERS = 'SET_USERS'
export const SET_CHANNELS = 'SET_CHANNELS'
export const SET_ROOMS = 'SET_ROOMS'
export const SET_PMS = 'SET_PMS'
export const TRACK_ANALYTICS = 'TRACK_ANALYTICS'
export const GO_TO = 'GO_TO'
export const GO_TO_MESSAGE = 'GO_TO_MESSAGE'
export const GO_TO_CHANNEL = 'GO_TO_CHANNEL'
export const HANDLE_ERROR = 'HANDLE_ERROR'
export const SET_USER = 'SET_USER'
export const SET_CHANNEL = 'SET_CHANNEL'
export const HANDLE_CHANGE_ROUTE = 'HANDLE_CHANGE_ROUTE'

export const SHOW_INTRO = 'SHOW_INTRO'
export const SHOW_NEXT_INTRO = 'SHOW_NEXT_INTRO'
export const HIDE_INTRO = 'HIDE_INTRO'

export const SET_SIDEBAR_IS_LOADING = 'SET_SIDEBAR_IS_LOADING'
export const SHOW_SIDEBAR = 'SHOW_SIDEBAR'
export const SHOW_SIDEBAR_SUBVIEW = 'SHOW_SIDEBAR_SUBVIEW'
export const HIDE_SIDEBAR = 'HIDE_SIDEBAR'
export const SET_SIDEBAR_OPTIONS = 'SET_SIDEBAR_OPTIONS'

export const UPDATE_USER = 'UPDATE_USER'
export const CHANGE_USER_STATUS = 'CHANGE_USER_STATUS'

export const ADD_USER_TO_ORG = 'ADD_USER_TO_ORG'
export const REMOVE_USER_FROM_ORG = 'REMOVE_USER_FROM_ORG'

export const ADD_CHANNEL = 'ADD_CHANNEL'
export const MARK_CHANNEL_AS_READ = 'MARK_CHANNEL_AS_READ'
export const MARK_MESSAGE_AS_SENT = 'MARK_MESSAGE_AS_SENT'

export const UPDATE_CHANNEL = 'UPDATE_CHANNEL'
export const UPDATE_CHANNEL_STATS = 'UPDATE_CHANNEL_STATS'
export const REMOVE_ROOM = 'REMOVE_ROOM'
export const REQUEST_ROOM_RENAME = 'REQUEST_ROOM_RENAME'
export const HANDLE_ROOM_RENAME_ERROR = 'HANDLE_ROOM_RENAME_ERROR'
export const CLEAR_ROOM_RENAME_ERROR = 'CLEAR_ROOM_RENAME_ERROR'
export const REQUEST_ROOM_CREATE = 'REQUEST_ROOM_CREATE'
export const HANDLE_ROOM_CREATE_ERROR = 'HANDLE_ROOM_CREATE_ERROR'
export const CLEAR_ROOM_CREATE_ERROR = 'CLEAR_ROOM_CREATE_ERROR'
export const SET_ROOM_DESCRIPTION = 'SET_ROOM_DESCRIPTION'
export const SET_ROOM_PRIVACY = 'SET_ROOM_PRIVACY'
export const SET_ROOM_COLOR = 'SET_ROOM_COLOR'
export const SET_ROOM_ICON = 'SET_ROOM_ICON'
export const SHOW_ROOM_DELETE_DIALOG = 'SHOW_ROOM_DELETE_DIALOG'
export const HIDE_ROOM_DELETE_DIALOG = 'HIDE_ROOM_DELETE_DIALOG'
export const REQUEST_JOIN_CHANNEL = 'REQUEST_JOIN_CHANNEL'
export const REQUEST_OPEN_PM = 'REQUEST_OPEN_PM'

export const AUTH_ERROR = 'AUTH_ERROR'
export const CONNECTION_ERROR = 'CONNECTION_ERROR'
export const HANDLE_AUTH_STATUS = 'HANDLE_AUTH_STATUS'

export const SHOW_BILLING_WARNING = 'SHOW_BILLING_WARNING'
export const HIDE_BILLING_WARNING = 'HIDE_BILLING_WARNING'
export const GO_TO_PAYMENT = 'GO_TO_PAYMENT'
export const GO_TO_ADD_INTEGRATIONS = 'GO_TO_ADD_INTEGRATIONS'

export const SET_TYPING_USERS = 'SET_TYPING_USERS'

export const REQUEST_LEAVE_CHANNEL = 'REQUEST_LEAVE_CHANNEL'
export const LEAVE_CHANNEL = 'LEAVE_CHANNEL'
export const REQUEST_KICK_MEMBER_FROM_CHANNEL = 'REQUEST_KICK_MEMBER_FROM_CHANNEL'
export const KICK_MEMBER_FROM_CHANNEL = 'KICK_MEMBER_FROM_CHANNEL'
export const ADD_USER_TO_CHANNEL = 'ADD_USER_TO_CHANNEL'
export const REMOVE_USER_FROM_CHANNEL = 'REMOVE_USER_FROM_CHANNEL'
export const HANDLE_CHANNEL_MEMBERS = 'HANDLE_CHANNEL_MEMBERS'

export const SHOW_CHANNEL_MEMBERS_INVITE = 'SHOW_CHANNEL_MEMBERS_INVITE'
export const HIDE_CHANNEL_MEMBERS_INVITE = 'HIDE_CHANNEL_MEMBERS_INVITE'
export const ADD_TO_CHANNEL_MEMBERS_INVITE = 'ADD_TO_INVITE_CHANNEL_MEMBERLIST'
export const REMOVE_FROM_CHANNEL_MEMBERS_INVITE = 'REMOVE_FROM_CHANNEL_MEMBERS_INVITE'
export const FILTER_CHANNEL_MEMBERS_INVITE = 'FILTER_CHANNEL_MEMBERS_INVITE'
export const INVITED_TO_CHANNEL = 'INVITED_TO_CHANNEL'
export const JOINED_CHANNEL = 'JOINED_CHANNEL'

export const LOAD_SHARED_FILES = 'LOAD_SHARED_FILES'
export const LOADED_SHARED_FILES = 'LOADED_SHARED_FILES'
export const ADD_SHARED_FILE = 'ADD_SHARED_FILE'
export const REMOVE_SHARED_FILE = 'REMOVE_SHARED_FILE'
export const OPEN_SHARED_FILE = 'OPEN_SHARED_FILE'

export const REQUEST_PINNED_MESSAGES = 'REQUEST_PINNED_MESSAGES'
export const HANDLE_PINNED_MESSAGES = 'HANDLE_PINNED_MESSAGES'
export const REQUEST_PIN_MESSAGE = 'REQUEST_PIN_MESSAGE'
export const REQUEST_UNPIN_MESSAGE = 'REQUEST_UNPIN_MESSAGE'

export const SHOW_MENTIONS = 'SHOW_MENTIONS'
export const LOAD_MENTIONS = 'LOAD_MENTIONS'
export const LOADED_MENTIONS = 'LOADED_MENTIONS'
export const ADD_MENTION = 'ADD_MENTION'
export const REMOVE_MENTION = 'REMOVE_MENTION'
export const TOGGLE_SHOW_ROOM_MENTION = 'TOGGLE_SHOW_ROOM_MENTION'

export const HANDLE_CHANNELS_TO_MENTION = 'HANDLE_CHANNELS_TO_MENTION'
export const HANDLE_FOUND_CHANNELS = 'HANDLE_FOUND_CHANNELS'
export const REQUEST_SEARCH_CHANNELS_TO_MENTION = 'REQUEST_SEARCH_CHANNELS_TO_MENTION'
export const REQUEST_SEARCH_FOUND_CHANNELS = 'REQUEST_SEARCH_FOUND_CHANNELS'
export const SET_FOCUSED_CHANNEL = 'SET_FOCUSED_CHANNEL'

export const SEARCH_MESSAGES = 'SEARCH_MESSAGES'
export const UPDATE_MESSAGE_SEARCH_QUERY = 'UPDATE_MESSAGE_SEARCH_QUERY'
export const FOUND_MESSAGES = 'FOUND_MESSAGES'
export const TOGGLE_SEARCH_IN_CHANNEL_ONLY = 'TOGGLE_SEARCH_IN_CHANNEL_ONLY'
export const TOGGLE_SEARCH_ACTIVITIES = 'TOGGLE_SEARCH_ACTIVITIES'

export const REQUEST_LABELED_MESSAGES = 'REQUEST_LABELED_MESSAGES'
export const HANDLE_LOADED_LABELED_MESSAGES = 'HANDLE_LOADED_LABELED_MESSAGES'
export const HANDLE_MORE_LOADED_LABELED_MESSAGES = 'HANDLE_MORE_LOADED_LABELED_MESSAGES'
export const HANDLE_MESSAGE_LABELED = 'HANDLE_MESSAGE_LABELED'
export const SELECT_LABELED_MESSAGE_FILTER = 'SELECT_LABELED_MESSAGE_FILTER'

export const REQUEST_LATEST_HISTORY = 'REQUEST_LATEST_HISTORY'
export const REQUEST_HISTORY_FRAGMENT = 'REQUEST_HISTORY_FRAGMENT'
export const REQUEST_OLDER_HISTORY = 'REQUEST_OLDER_HISTORY'
export const REQUEST_NEWER_HISTORY = 'REQUEST_NEWER_HISTORY'
export const HANDLE_INITIAL_HISTORY = 'HANDLE_INITIAL_HISTORY'
export const HANDLE_MORE_HISTORY = 'HANDLE_MORE_HISTORY'
export const CLEAR_HISTORY = 'CLEAR_HISTORY'

export const REQUEST_REMOVE_MESSAGES = 'REQUEST_REMOVE_MESSAGES'
export const REMOVE_MESSAGE = 'REMOVE_MESSAGE'
export const EDIT_MESSAGE = 'EDIT_MESSAGE'
export const EDIT_MESSAGE_SEND = 'EDIT_MESSAGE_SEND'
export const EDIT_MESSAGE_ABORT = 'EDIT_MESSAGE_ABORT'
export const UPDATE_MESSAGE = 'UPDATE_MESSAGE'
export const REQUEST_POST_MESSAGE = 'REQUEST_POST_MESSAGE'
export const ADD_NEW_MESSAGE = 'ADD_NEW_MESSAGE'
export const MARK_MESSAGE_AS_UNSENT = 'MARK_MESSAGE_AS_UNSENT'
export const RESEND_MESSAGE = 'RESEND_MESSAGE'
export const REQUEST_READ_MESSAGE = 'REQUEST_READ_MESSAGE'
export const UNSET_HISTORY_SCROLL_TO = 'UNSET_HISTORY_SCROLL_TO'
export const INSERT_MESSAGE_QUOTE = 'INSERT_MESSAGE_QUOTE'
export const SET_UNSENT_MESSAGE = 'SET_UNSENT_MESSAGE'

export const HANDLE_NOTIFICATION = 'HANDLE_NOTIFICATION'
export const ENABLE_BROWSER_NOTIFICATIONS = 'ENABLE_BROWSER_NOTIFICATIONS'
export const REQUEST_BROWSER_NOTIFICATION_SESSION = 'REQUEST_BROWSER_NOTIFICATION_SESSION'

export const SHOW_ALERT = 'SHOW_ALERT'
export const HIDE_ALERT = 'HIDE_ALERT'

export const REQUEST_SEARCH_USERS = 'REQUEST_SEARCH_USERS'
export const HANDLE_SEARCH_USERS = 'HANDLE_SEARCH_USERS'

export const SHOW_CHANNELS_MANAGER = 'SHOW_CHANNELS_MANAGER'
export const SHOW_NEW_CONVERSATION = 'SHOW_NEW_CONVERSATION'
export const HIDE_NEW_CONVERSATION = 'HIDE_NEW_CONVERSATION'
export const ADD_TO_NEW_CONVERSATION = 'ADD_TO_NEW_CONVERSATION'
export const REMOVE_FROM_NEW_CONVERSATION = 'REMOVE_FROM_NEW_CONVERSATION'

export const SHOW_INVITE_TO_ORG = 'SHOW_INVITE_TO_ORG'
export const HIDE_INVITE_TO_ORG = 'HIDE_INVITE_TO_ORG'
export const SET_INVITE_TO_ORG_LINK = 'SET_INVITE_TO_ORG_LINK'
export const HANDLE_INVITE_TO_ORG_ERROR = 'HANDLE_INVITE_TO_ORG_ERROR'
export const CLEAR_INVITE_TO_ORG_ERROR = 'CLEAR_INVITE_TO_ORG_ERROR'

export const UPDATE_MEMBERSHIP = 'UPDATE_MEMBERSHIP'

export const MARK_FAVORITED = 'MARK_FAVORITED'
export const REQUEST_ADD_CHANNEL_TO_FAVORITES = 'REQUEST_ADD_CHANNEL_TO_FAVORITES'
export const REQUEST_REMOVE_CHANNEL_FROM_FAVORITES = 'REQUEST_REMOVE_CHANNEL_FROM_FAVORITES'
export const CHANGE_FAVORITED = 'CHANGE_FAVORITED'

export const SHOW_NOTIFICATION_SETTINGS = 'SHOW_NOTIFICATION_SETTINGS'
export const HIDE_NOTIFICATION_SETTINGS = 'HIDE_NOTIFICATION_SETTINGS'
export const REQUEST_NOTIFICATION_SETTINGS_UPDATE = 'REQUEST_NOTIFICATION_SETTINGS_UPDATE'
export const REQUEST_NOTIFICATION_SETTINGS = 'REQUEST_NOTIFICATION_SETTINGS'
export const HANDLE_NOTIFICATION_SETTINGS = 'HANDLE_NOTIFICATION_SETTINGS'

export const SHOW_MARKDOWN_TIPS = 'SHOW_MARKDOWN_TIPS'
export const HIDE_MARKDOWN_TIPS = 'HIDE_MARKDOWN_TIPS'

export const PLAY_SOUND = 'PLAY_SOUND'
export const END_SOUND = 'END_SOUND'

export const SHOW_TOAST_NOTIFICATION = 'SHOW_TOAST_NOTIFICATION'
export const HIDE_TOAST_NOTIFICATION = 'HIDE_TOAST_NOTIFICATION'
export const UPDATE_TOAST_NOTIFICATION = 'UPDATE_TOAST_NOTIFICATION'

export const START_FILE_UPLOAD = 'START_FILE_UPLOAD'
export const UPDATE_FILE_UPLOAD_PROGRESS = 'UPDATE_FILE_UPLOAD_PROGRESS'
export const END_FILE_UPLOAD = 'END_FILE_UPLOAD'
export const HANDLE_FILE_UPLOAD_ERROR = 'HANDLE_FILE_UPLOAD_ERROR'
export const HANDLE_UPLOAD_COMPLETE = 'HANDLE_UPLOAD_COMPLETE'
export const HANDLE_REJECTED_FILES = 'HANDLE_REJECTED_FILES'
export const SET_OPEN_FILE_DIALOG_HANDLER = 'SET_OPEN_FILE_DIALOG_HANDLER'

export const SET_TYPING = 'SET_TYPING'
export const SHOW_EMOJI_BROWSER = 'SHOW_EMOJI_BROWSER'
export const SHOW_EMOJI_SUGGEST_BROWSER = 'SHOW_EMOJI_SUGGEST_BROWSER'
export const SHOW_USERS_AND_ROOMS_BROWSER = 'SHOW_USERS_AND_ROOMS_BROWSER'
export const SHOW_SEARCH_BROWSER = 'SHOW_SEARCH_BROWSER'
export const HIDE_BROWSER = 'HIDE_BROWSER'
export const REQUEST_AUTOCOMPLETE = 'REQUEST_AUTOCOMPLETE'
export const HANDLE_AUTOCOMPLETE = 'HANDLE_AUTOCOMPLETE'
export const REQUEST_AUTOCOMPLETE_SERVICES = 'REQUEST_AUTOCOMPLETE_SERVICES'
export const HANDLE_AUTOCOMPLETE_SERVICES = 'HANDLE_AUTOCOMPLETE_SERVICES'
export const REQUEST_AUTOCOMPLETE_SERVICES_STATS = 'REQUEST_AUTOCOMPLETE_SERVICES_STATS'
export const HANDLE_AUTOCOMPLETE_SERVICES_STATS = 'HANDLE_AUTOCOMPLETE_SERVICES_STATS'

export const SHOW_MANAGE_GROUPS = 'SHOW_MANAGE_GROUPS'
export const HIDE_MANAGE_GROUPS = 'HIDE_MANAGE_GROUPS'
export const SET_MANAGE_GROUPS_FILTER = 'SET_MANAGE_GROUPS_FILTER'

export const SHOW_REMOVE_LINK_ATTACHMENT = 'SHOW_REMOVE_LINK_ATTACHMENT'
export const HIDE_REMOVE_LINK_ATTACHMENT = 'HIDE_REMOVE_LINK_ATTACHMENT'
export const REQUEST_REMOVE_LINK_ATTACHMENT = 'REQUEST_REMOVE_LINK_ATTACHMENT'

export const LOGIN_FROM_EMBEDDED = 'LOGIN_FROM_EMBEDDED'
