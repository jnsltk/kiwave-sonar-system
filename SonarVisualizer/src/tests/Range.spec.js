import { render } from "@testing-library/svelte";
import Range from "../components/gui/Range.svelte";

describe('Unit tests for gui', ()=>{

    const { getByTestId } = render(Range);

    const range = getByTestId('range');

    test('maximum valid range', ()=>{

        // Maximum valid range is 220.
        
        expect(range).toBeInTheDocument();

        range.stepUp(10);
        expect(range.value).toEqual("110");

        range.stepUp(200);
        expect(range.value).toEqual("220");

    });


    test('minimum valid range', ()=>{

        // Minimum valid range is 1.

        range.stepDown(100);
        expect(range.value).toEqual("120");

        range.stepDown(120);
        expect(range.value).toEqual("1");

        range.stepDown(30);
        expect(range.value).toEqual("1");

    });
});