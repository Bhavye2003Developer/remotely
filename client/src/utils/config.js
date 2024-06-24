const PORT = 3000;
const server_ip = `${location.hostname}:${PORT}`;

export const TOUCHPAD_URL = `ws://${server_ip}/real-time`;
export const TOUCHPAD_CLICK_URL = `http://${server_ip}/touchpad/click`;
export const RIGHT_CLICK_URL = `http://${server_ip}/touchpad/right-click`;
export const LEFT_CLICK_URL = `http://${server_ip}/touchpad/left-click`;
export const FILE_UPLOAD_URL = `http://${server_ip}/upload`;
export const SIGNAL_SERVER_URL = `ws://${server_ip}/reach-signal-server`;
