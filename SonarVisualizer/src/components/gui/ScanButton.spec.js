import { render , fireEvent, getByTitle, getByText, waitFor} from '@testing-library/svelte';
import ScanButton from './ScanButton.svelte';

describe('ScanButton', () => {

    test('response to click scan button', async () => {
 
        const {getByText, getByTestId} = render(ScanButton);

        const scanButton = getByText('Start scanning');

        expect(scanButton).toBeInTheDocument();
        expect(scanButton.textContent).toMatch('Start scanning');

        await fireEvent.click(scanButton); // clicking the button

        expect(scanButton.textContent).toMatch('Stop scanning');
    });

});