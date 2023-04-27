import { render } from '@testing-library/svelte';
import ScanButton from './ScanButton.svelte';
import { toggleScan } from './ScanButton.svelte'

describe('ScanButton', () => {

    test('running', () => {
 
        const scanButton = render(ScanButton);

        let result = toggleScan();

        expect(result).toEqual('Starting!');

    });

});