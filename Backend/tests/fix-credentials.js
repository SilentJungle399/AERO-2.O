// Script to fix Google credentials private key format
const fs = require('fs');
const path = require('path');

function fixPrivateKeyFormat() {
    const credentialsPath = path.join(__dirname, 'config', 'google-credentials.json');
    
    try {
        // Read the current credentials
        const credentialsContent = fs.readFileSync(credentialsPath, 'utf8');
        const credentials = JSON.parse(credentialsContent);
        
        // Fix the private key format
        if (credentials.private_key) {
            // Remove existing \n and spaces, then properly format
            let privateKey = credentials.private_key;
            
            // Remove all \n characters and extra spaces
            privateKey = privateKey.replace(/\\n/g, '').replace(/\s+/g, ' ').trim();
            
            // Split by the header and footer
            const beginMarker = '-----BEGIN PRIVATE KEY-----';
            const endMarker = '-----END PRIVATE KEY-----';
            
            // Extract just the key content
            const keyStart = privateKey.indexOf(beginMarker) + beginMarker.length;
            const keyEnd = privateKey.indexOf(endMarker);
            const keyContent = privateKey.substring(keyStart, keyEnd).trim();
            
            // Rebuild with proper line breaks every 64 characters
            let formattedKey = beginMarker + '\n';
            for (let i = 0; i < keyContent.length; i += 64) {
                formattedKey += keyContent.substring(i, i + 64) + '\n';
            }
            formattedKey += endMarker + '\n';
            
            // Update the credentials object
            credentials.private_key = formattedKey;
            
            // Write back to file
            fs.writeFileSync(credentialsPath, JSON.stringify(credentials, null, 2));
            
            console.log('✅ Private key format fixed successfully');
            console.log('Updated credentials file with properly formatted private key');
        } else {
            console.log('❌ No private_key found in credentials file');
        }
    } catch (error) {
        console.error('❌ Error fixing private key format:', error.message);
    }
}

// Run the fix
fixPrivateKeyFormat();
