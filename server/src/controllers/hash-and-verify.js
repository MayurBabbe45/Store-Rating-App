const bcrypt = require('bcrypt');

async function run() {
  try {
    const plain = 'Admin@1234!';
    const saltRounds = 10; // reasonable default

    // generate hash
    const hash = await bcrypt.hash(plain, saltRounds);
    console.log('Hashed password:', hash);

    // to verify later
    const isMatch = await bcrypt.compare(plain, hash);
    console.log('Password matches:', isMatch); // true
  } catch (err) {
    console.error('Error:', err);
  }
}
run();