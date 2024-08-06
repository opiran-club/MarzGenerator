document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const finalElement = document.getElementById('final');
  const copyButton = document.getElementById('sutton');
  const youtubeButton = document.getElementById('youtube');
  const githubButton = document.getElementById('github');
  const github1Button = document.getElementById('github1');
  const randomButton = document.getElementById("random");
  const MainForm = document.getElementById('MainDetails');
  const protocolDetailsForm = document.getElementById('protocolDetails');

  // Event Listeners
  copyButton.addEventListener('click', copyToClipboard);
  youtubeButton.addEventListener('click', () => window.open('https://www.youtube.com/channel/UCDBnd7heT6Gz6QgqtxvtuEw/', '_blank'));
  githubButton.addEventListener('click', () => window.open('https://github.com/azavaxhuman', '_blank'));
  github1Button.addEventListener('click', () => window.open('https://github.com/Gozargah/Marzban', '_blank'));
  randomButton.addEventListener('click', randomize);

  // Main function to update protocol details
  function protocolDetails() {
    const protocol = MainForm.elements.protocol.value;
    const transmission = MainForm.elements.transmission.value;
    const security = MainForm.elements.security.value;
    const headertype = document.getElementById('header').value;
    const path = document.getElementById('path').value;
    const sniffing = document.getElementById('sniffing').checked;
    const checkboxes = document.querySelectorAll('.group-checkbox');
    
    let destOverride = '';
    let sniftext = '';
    
    // Configure sniffing options
    function configureSniffing() {
      if (sniffing) {
        document.getElementById("sniffingDiv").style.display = "block";
        document.getElementById("SniffingCheckbox").style.display = "block";
        
        const selectedOptions = Array.from(checkboxes)
          .filter(checkbox => checkbox.checked)
          .map(checkbox => `"${checkbox.name}"`)
          .join(', ');
        
        destOverride = selectedOptions || '';
        
        if (!destOverride) {
          document.getElementById('sniffing').checked = false;
          checkboxes.forEach(checkbox => checkbox.checked = true);
          document.getElementById("SniffingCheckbox").style.display = "none";
          return '';
        }
        return destOverride;
      } else {
        document.getElementById("SniffingCheckbox").style.display = "none";
        return '';
      }
    }

    sniftext = `, "sniffing": { "enabled": true, "destOverride": [${configureSniffing()}] }`;

    const protocolMapping = { vless: 1, vmess: 2, trojan: 5, shadowsocks: 9 };
    const transmissionMapping = { tcp: 1, ws: 2, H2: 3, QUIC: 4, grpc: 5, tcpudp: 7, tcpS: 8, udpS: 9 };
    const securityMapping = { tls: 1, reality: 5, none: 0 };
    const headerMapping = { None: 0, http: 1 };

    const p = protocolMapping[protocol];
    const t = transmissionMapping[transmission];
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
    const acceptProxyProtocol = document.getElementById('acceptProxyProtocol').checked ? `"acceptProxyProtocol": true` : '';
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

    // Update visibility of protocol details
    protocolDetailsForm.style.display = 'block';
    document.getElementById('http_header_Fields').style.display = h === 0 ? 'none' : 'block';

    // Update transmission options based on protocol
    const isTransmissionOptionsVisible = [3, 4, 5].includes(t);
    document.getElementById('divheader').style.display = isTransmissionOptionsVisible ? 'none' : 'block';
    
    if (headerOnOff) {
      if (t !== 2) {
        document.getElementById('sarbarg').style.display = 'block';
        wsheader.style.display = 'none';
      } else {
        wsheader.style.display = 'block';
        document.getElementById('sarbarg').style.display = 'none';
      }
    } else {
      wsheader.style.display = 'none';
      document.getElementById('sarbarg').style.display = 'none';
    }

    // Update security options visibility
    DisplayBlock('Tls', s === 1);
    DisplayBlock('RealityForm', s === 5);

    function DisplayBlock(id, show) {
      document.getElementById(id).style.display = show ? 'block' : 'none';
    }

    function BuildTLS() {
      const pathsArray = path ? `, "paths": ["${path}"]` : '';
      return `, "streamSettings": { "network": "${transmission}", "security": "tls", "tlsSettings": { "serverName": "${sni}", "certificates": [{ "certificateFile": "${pubkey}", "keyFile": "${pvkey}" }] }, "httpSettings": { "path": "${path}", "host": ["${ServerNames}"] }, "grpcSettings": { "serviceName": "${path}" }, "quicSettings": { "security": "none", "key": "${path}" }, "wsSettings": { "headers": { "Host": "${wsheader.value}" }, "path": "${path}" }, "tcpSettings": { "header": { "type": "${headertype}" } }, "sockopt": { ${acceptProxyProtocol} } ${pathsArray} }`;
    }

    function BuildReality() {
      return `, "streamSettings": { "network": "${transmission}", "security": "reality", "realitySettings": { "serverNames": ["${ServerNames}"], "privateKey": "${PrivateKey}", "shortIds": ["${ShortIds}"] }, "httpSettings": { "path": "${path}", "host": ["${ServerNames}"] }, "grpcSettings": { "serviceName": "${path}" }, "quicSettings": { "security": "none", "key": "${path}" }, "wsSettings": { "headers": { "Host": "${wsheader.value}" }, "path": "${path}" }, "tcpSettings": { "header": { "type": "${headertype}" } }, "sockopt": { ${acceptProxyProtocol} } }`;
    }

    let details = `{
      "port": ${port},
      "listen": "::",
      "protocol": "${protocol}",
      "tag": "${name}",
      "settings": {
        "clients": [{ "id": "${document.getElementById('uuid').value}", "flow": "", "email": "" }]
      },
      "streamSettings": {
        "network": "${transmission}",
        "security": "none",
        "tlsSettings": null,
        "httpSettings": { "path": "${path}", "host": ["${ServerNames}"] },
        "grpcSettings": { "serviceName": "${path}" },
        "quicSettings": { "security": "none", "key": "${path}" },
        "wsSettings": { "headers": { "Host": "${wsheader.value}" }, "path": "${path}" },
        "tcpSettings": { "header": { "type": "${headertype}" } },
        "sockopt": { ${acceptProxyProtocol} }
      },
      "sniffing": { "enabled": true, "destOverride": [${configureSniffing()}] }
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

  // Function to copy text to clipboard
  function copyToClipboard() {
    finalElement.select();
    document.execCommand('copy');
  }

  // Function to generate random UUID
  function generateUUID() {
    let d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  // Function to randomize UUID and set values
  function randomize() {
    const uuid = generateUUID();
    document.getElementById('uuid').value = uuid;
    finalElement.value = uuid;
  }

  // Initialize protocol details on page load and form changes
  document.getElementById('MainDetails').addEventListener('change', protocolDetails);
  document.getElementById('protocolDetails').addEventListener('change', protocolDetails);
  protocolDetails();
});
