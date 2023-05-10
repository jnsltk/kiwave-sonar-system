// @ts-nocheck
import { render , fireEvent} from '@testing-library/svelte';
import ScanButton from "../components/gui/ScanButton.svelte";
import { sonarCommands,sonarStore } from "../data/stores";
import { get } from 'svelte/store'





describe('ScanButton', () => {

    let runSonar;

    const {getByText, getByTestId} = render(ScanButton);

    const scanButton = getByText('Start scanning');

   

    test('response to click scan button', async () => {

        const unsubscribe = sonarCommands.subscribe((value) => {
            runSonar = value.sonarData.runSonar;
        });
        console.log(get(sonarStore))
        console.log(get(sonarCommands))

        expect(scanButton).toBeInTheDocument();

        expect(scanButton.textContent).toMatch('Start scanning');
        expect(runSonar).toBe(false);

        await fireEvent.click(scanButton); // clicking the button

        expect(scanButton.textContent).toMatch("Awaiting...");
        expect(runSonar).toEqual(true);

        let oldValue=get(sonarStore);
        oldValue.sonarStatus.lastCommandReceived=true;
        sonarStore.set(oldValue);
        console.log(get(sonarStore))
        console.log(get(sonarCommands))
        console.log(scanButton.textContent)
        expect(scanButton.textContent).toMatch("Stop scanning");

        unsubscribe();
    });

});
