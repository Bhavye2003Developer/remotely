const os = require("os");
const get_ip = () => {
  const networkInterfaces = os.networkInterfaces();

  // Find the IPv4 address associated with the local network interface
  const localIpAddress = Object.values(networkInterfaces)
    .flat()
    .filter((iface) => iface.family === "IPv4" && !iface.internal)
    .map((iface) => iface.address)[0];

  return localIpAddress;
};

module.exports = get_ip;
