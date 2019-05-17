import { SynthetixJs } from '../../../src/index.node.js';
import ContractSettings from '../../../src/contractSettings';
import * as snx from 'synthetix';

const { SUPPORTED_NETWORKS } = ContractSettings;

const contract = 'Depot';

describe(`src/contracts/${contract}`, () => {
  Object.entries(SUPPORTED_NETWORKS).forEach(([networkId, network]) => {
    let snxjs;
    beforeAll(() => {
      snxjs = new SynthetixJs({ networkId });
    });

    test(
      `${network} Should return synthetixsReceivedForEther for 1 ETH`,
      async () => {
        const synthetixReceivedForEther = await snxjs[contract].synthetixReceivedForEther(
          snxjs.utils.parseEther('1')
        );
        expect(snxjs.utils.formatEther(synthetixReceivedForEther)).not.toBeNaN();
      },
      15000
    );

    // skip ropsten for now as it isn't configured properly
    const testRunner = network === 'ropsten' ? test.skip : test;
    testRunner(
      `${network} Should have correct Synthetix address`,
      async () => {
        const synthetix = await snxjs[contract].synthetix();
        const expectedAddress = snx.getTarget({ network, contract: 'Synthetix' }).address;

        expect(synthetix).toEqual(expectedAddress);
      },
      15000
    );
  });
});