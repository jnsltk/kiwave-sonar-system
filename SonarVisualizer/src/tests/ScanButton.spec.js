import { render , fireEvent} from '@testing-library/svelte';
import ScanButton from "../components/gui/ScanButton.svelte";
import { sonarCommands } from "../data/stores";


describe('ScanButton', () => {

    let runSonar;

    const {getByText, getByTestId} = render(ScanButton);

    const scanButton = getByText('Start scanning');

   

    test('response to click scan button', async () => {

        const unsubscribe = sonarCommands.subscribe((value) => {
            runSonar = value.sonarData.runSonar;
        });
    
        expect(scanButton).toBeInTheDocument();

        expect(scanButton.textContent).toMatch('Start scanning');
        expect(runSonar).toBe(false);

        await fireEvent.click(scanButton); // clicking the button

        expect(scanButton.textContent).toMatch("Stop scanning");
        expect(runSonar).toEqual(true);

        unsubscribe();
    });

});
