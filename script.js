document.addEventListener('DOMContentLoaded', () => {
  const finalElement = document.getElementById('final');
  const copyButton = document.getElementById('sutton');
  const youtubeButton = document.getElementById('youtube');
  const githubButton = document.getElementById('github');
  const github1Button = document.getElementById('github1');
  const randomButton = document.getElementById("random");

  copyButton.addEventListener('click', () => {
    finalElement.select();
    document.execCommand('copy');
  });

  youtubeButton.addEventListener('click', () => {
    window.open('https://www.youtube.com/channel/UCDBnd7heT6Gz6QgqtxvtuEw/', '_blank');
  });

  githubButton.addEventListener('click', () => {
    window.open('https://github.com/azavaxhuman', '_blank');
  });

  github1Button.addEventListener('click', () => {
    window.open('https://github.com/Gozargah/Marzban', '_blank');
  });

  randomButton.addEventListener('click', randomize);

  function protocolDetails() {
    const MainForm = document.getElementById('MainDetails');
    let protocol = MainForm.elements.protocol.value;
    let transmission = MainForm.elements.transmission.value;
    let security = MainForm.elements.security.value;
    const headertype = document.getElementById('header').value;
    const path = document.getElementById('path').value;
    let sniffing = document.getElementById('sniffing').checked;
    let destOverride = "";
    let sniftext = '';
    const checkboxes = document.querySelectorAll('.group-checkbox');
    const transmissions = document.getElementById("transmissions");
    const idsecurity = document.getElementById("idsecurity");

    function sniffingconfig(config) {
      if (config) {
        document.getElementById("sniffingDiv").style.display = "block";
        document.getElementById("SniffingCheckbox").style.display = "block";

        function updateSelectedOptions() {
          const selectedOptions = [];

          checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
              selectedOptions.push(`"${checkbox.name}"`);
            }
          });

          destOverride = selectedOptions.join(', ') || '';
          if (!destOverride) {
            document.getElementById('sniffing').checked = false;
            checkboxes.forEach(checkbox => {
              checkbox.checked = true;
            });
            document.getElementById("SniffingCheckbox").style.display = "none";
            sniffing = false;
          }
          return destOverride;
        }

        return updateSelectedOptions();
      } else {
        document.getElementById("SniffingCheckbox").style.display = "none";
        return '';
      }
    }

    sniftext = `,
    "sniffing": {
      "enabled": true,
      "destOverride": [${sniffingconfig(sniffing)}]
    }`;

    const protocolMapping = {
      vless: 1,
      vmess: 2,
      trojan: 5,
      shadowsocks: 9
    };

    const transsportMapping = {
      tcp: 1,
      ws: 2,
      H2: 3,
      QUIC: 4,
      grpc: 5,
      tcpudp: 7,
      tcpS: 8,
      udpS: 9,
    };

    const securityMapping = {
      tls: 1,
      reality: 5,
      none: 0
    };

    const headerMapping = {
      None: 0,
      http: 1
    };

    const p = protocolMapping[protocol];
    const t = transsportMapping[transmission];
    const s = securityMapping[security];
    const h = headerMapping[headertype];
    const pt = `${p}${t}`;
    const pts = `${p}${t}${s}`;

    // Form Variables
    const port = document.getElementById('port').value;
    const name = document.getElementById('inboundname').value;
    const pubkey = document.getElementById('pubkey').value;
    const pvkey = document.getElementById('pvkey').value;
    const sni = document.getElementById('sni').value.replace(/(http:\/\/|https:\/\/|\/)/g, '');
    let acceptProxyProtocol = document.getElementById('acceptProxyProtocol').checked;
    const headerOnOff = document.getElementById('headerOnOff').checked;
    const wsheader = document.getElementById('wsheader');
    const userdest = document.getElementById('dest').value;
    const dest = userdest.includes(":443") ? userdest : `${userdest}:443`;
    const ServerNames = document.getElementById('ServerNames').value;
    const ShortIds = document.getElementById('ShortIds').value;
    const PublicKey = document.getElementById('PublicKey').value;
    const PrivateKey = document.getElementById('PrivateKey').value;
    const publickeyStatus = document.getElementById('publickeyStatusOnOff').checked;
    const TlsForm = document.getElementById('Tls');
    const RealityForm = document.getElementById('RealityForm');

    document.getElementById('protocolDetails').style.display = 'block';
    document.getElementById('http_header_Fields').style.display = h === 0 ? 'none' : 'block';

    if ([3, 4, 5].includes(t)) {
      document.getElementById('divheader').style.display = 'none';
    } else {
      document.getElementById('divheader').style.display = 'block';
    }

    if (headerOnOff) {
      if (t !== 2) {
        document.getElementById('sarbarg').style.display = 'block';
        document.getElementById('wsheader').style.display = 'none';
      } else {
        document.getElementById('wsheader').style.display = 'block';
        document.getElementById('sarbarg').style.display = 'none';
      }
    } else {
      document.getElementById('wsheader').style.display = 'none';
      document.getElementById('sarbarg').style.display = 'none';
    }

    headerOnOff = h !== 0 && document.getElementById('headerOnOff').checked;

    if (acceptProxyProtocol) {
      acceptProxyProtocol = `"acceptProxyProtocol": true`;
    } else {
      acceptProxyProtocol = '';
    }

    if (p === 1) {
      transmissions.innerHTML = `
        <div id="transmissions" onload="actualname()">
          <label for="transmission">Transmission</label>
          <select name="transmission" id="transmission">
            <option value="tcp">TCP</option>
            <option value="ws">WS(Websocket)</option>
            <option value="grpc">GRPC</option>
            <option value="QUIC">QUIC</option>
            <option value="H2">H2</option>
          </select>
        </div>`;
      document.querySelector('select[name="transmission"]').value = transmission;
    } else {
      transmissions.innerHTML = `
        <div id="transmissions">
          <label for="transmission">Transmission</label>
          <select name="transmission" id="transmission">
            <option value="tcp">TCP</option>
            <option value="ws">WS(Websocket)</option>
            <option value="grpc">GRPC</option>
          </select>
        </div>`;
      if (transmission === 'H2') {
        transmission = 'tcp';
        protocolDetails();
        actualname();
      }
      document.querySelector('select[name="transmission"]').value = transmission;
    }

    if (p === 9) {
      idsecurity.style.display = 'none';
      sniftext = '';
    } else {
      idsecurity.style.display = 'block';
    }

    document.querySelector('select[name="security"]').value = security;

    function DisplayBlock(id, show) {
      const div = document.getElementById(id);
      div.style.display = show ? 'block' : 'none';
    }

    DisplayBlock('Tls', s === 1);
    DisplayBlock('RealityForm', s === 5);

    function BuildTLS() {
      const pathsArray = path ? `, "paths": ["${path}"]` : '';
      return `,
        "streamSettings": {
          "network": "${transmission}",
          "security": "tls",
          "tlsSettings": {
            "serverName": "${sni}",
            "certificates": [{
              "certificateFile": "${pubkey}",
              "keyFile": "${pvkey}"
            }]
          },
          "httpSettings": {
            "path": "${path}",
            "host": ["${ServerNames}"]
          },
          "grpcSettings": {
            "serviceName": "${path}"
          },
          "quicSettings": {
            "security": "none",
            "key": "${path}"
          },
          "wsSettings": {
            "headers": {
              "Host": "${wsheader.value}"
            },
            "path": "${path}"
          },
          "tcpSettings": {
            "header": {
              "type": "${headertype}"
            }
          },
          "sockopt": {
            ${acceptProxyProtocol}
          }
          ${pathsArray}
        }`;
    }

    function BuildReality() {
      return `, 
        "streamSettings": {
          "network": "${transmission}",
          "security": "reality",
          "realitySettings": {
            "serverNames": ["${ServerNames}"],
            "privateKey": "${PrivateKey}",
            "shortIds": ["${ShortIds}"]
          },
          "httpSettings": {
            "path": "${path}",
            "host": ["${ServerNames}"]
          },
          "grpcSettings": {
            "serviceName": "${path}"
          },
          "quicSettings": {
            "security": "none",
            "key": "${path}"
          },
          "wsSettings": {
            "headers": {
              "Host": "${wsheader.value}"
            },
            "path": "${path}"
          },
          "tcpSettings": {
            "header": {
              "type": "${headertype}"
            }
          },
          "sockopt": {
            ${acceptProxyProtocol}
          }
        }`;
    }

    let details = `{
      "port": ${port},
      "listen": "::",
      "protocol": "${protocol}",
      "tag": "${name}",
      "settings": {
        "clients": [{
          "id": "${document.getElementById('uuid').value}",
          "flow": "",
          "email": ""
        }]
      },
      "streamSettings": {
        "network": "${transmission}",
        "security": "none",
        "tlsSettings": null,
        "httpSettings": {
          "path": "${path}",
          "host": ["${ServerNames}"]
        },
        "grpcSettings": {
          "serviceName": "${path}"
        },
        "quicSettings": {
          "security": "none",
          "key": "${path}"
        },
        "wsSettings": {
          "headers": {
            "Host": "${wsheader.value}"
          },
          "path": "${path}"
        },
        "tcpSettings": {
          "header": {
            "type": "${headertype}"
          }
        },
        "sockopt": {
          ${acceptProxyProtocol}
        }
      },
      "sniffing": {
        "enabled": true,
        "destOverride": [${sniffingconfig(sniffing)}]
      }
    }`;

    switch (pts) {
      case '111':
        details = details.replace(/"streamSettings": \{[^}]+\},/, BuildTLS());
        break;
      case '115':
        details = details.replace(/"streamSettings": \{[^}]+\},/, BuildReality());
        break;
      default:
        break;
    }

    finalElement.value = details;
  }

  function randomize() {
    const uuid = generateUUID();
    document.getElementById('uuid').value = uuid;
    document.getElementById('final').value = uuid;
  }

  function generateRandomString(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  function generateUUID() {
    let d = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  document.getElementById('MainDetails').addEventListener('change', protocolDetails);
  document.getElementById('protocolDetails').addEventListener('change', protocolDetails);
  protocolDetails();
});
