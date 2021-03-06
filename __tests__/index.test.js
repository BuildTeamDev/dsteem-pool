import { Client } from '../src/index'

test('Test Original', async (done) => {
  const client = new Client('https://api.steemit.com');
  client.database.getDiscussions('trending', {tag: 'writing', limit: 1}).then((discussions) => {
    expect(discussions.length).toEqual(1);
    done();
  });
}, 10000);

test('Test Fallback', async (done) => {
  const client = new Client([
    'https://demo.fakeurl.com',
    'https://api.steemit.com'
  ]);
  client.database.getDiscussions('trending', {tag: 'writing', limit: 1}).then((discussions) => {
    expect(discussions.length).toEqual(1);
    done();
  });
}, 75000);
