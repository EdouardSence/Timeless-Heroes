
const { connect, JSONCodec } = require('nats');

async function test() {
  const nc = await connect({ servers: "nats://localhost:4222" });
  const jc = JSONCodec();
  
  const msg = await nc.request("progression.getLeaderboard", jc.encode({ type: "GLOBAL" }), { timeout: 5000 });
  console.log(JSON.stringify(jc.decode(msg.data), null, 2));
  
  await nc.close();
}

test().catch(console.error);
