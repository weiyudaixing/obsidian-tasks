/**
 * @jest-environment jsdom
 */
import { type RenderResult, fireEvent, render } from '@testing-library/svelte';
import moment from 'moment/moment';
import { TASK_FORMATS } from '../../src/Config/Settings';
import DateEditor from '../../src/ui/DateEditor.svelte';
import DateEditorWrapper from './DateEditorWrapper.svelte';

import { getAndCheckRenderedElement } from './RenderingTestHelpers';

window.moment = moment;

function renderDateEditor() {
    const result: RenderResult<DateEditor> = render(DateEditor, {
        id: 'due',
        dateSymbol: TASK_FORMATS.tasksPluginEmoji.taskSerializer.symbols.dueDateSymbol,
        date: '',
        isDateValid: true,
        forwardOnly: true,
        accesskey: 'D',
    });

    const { container } = result;
    expect(() => container).toBeTruthy();
    return { result, container };
}

describe('date editor tests', () => {
    it('should render and read input value', async () => {
        const { container } = renderDateEditor();
        const dueDateInput = getAndCheckRenderedElement<HTMLInputElement>(container, 'due');

        expect(dueDateInput.value).toEqual('');

        await fireEvent.input(dueDateInput, { target: { value: '2024-10-01' } });

        expect(dueDateInput.value).toEqual('2024-10-01');
    });
});

function renderDateEditorWrapper() {
    const result: RenderResult<DateEditorWrapper> = render(DateEditorWrapper, {});

    const { container } = result;
    expect(() => container).toBeTruthy();
    return { result, container };
}

beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-04-20'));
});

afterEach(() => {
    jest.useRealTimers();
});

describe('date editor wrapper tests', () => {
    it('should initialise fields correctly', () => {
        const { container } = renderDateEditorWrapper();
        const dueDateInput = getAndCheckRenderedElement<HTMLInputElement>(container, 'due');
        const dueDateFromDateEditorInput = getAndCheckRenderedElement<HTMLInputElement>(
            container,
            'dueDateFromDateEditor',
        );
        const parsedDateFromDateEditor = getAndCheckRenderedElement<HTMLInputElement>(
            container,
            'parsedDateFromDateEditor',
        );

        expect(dueDateInput.value).toEqual('');
        expect(dueDateFromDateEditorInput.value).toEqual('');
        expect(parsedDateFromDateEditor.value).toEqual('<i>no due date</i>');
    });

    it('should replace an empty date field with typed date value', async () => {
        const { container } = renderDateEditorWrapper();
        const dueDateInput = getAndCheckRenderedElement<HTMLInputElement>(container, 'due');
        const dueDateFromDateEditorInput = getAndCheckRenderedElement<HTMLInputElement>(
            container,
            'dueDateFromDateEditor',
        );
        const parsedDateFromDateEditor = getAndCheckRenderedElement<HTMLInputElement>(
            container,
            'parsedDateFromDateEditor',
        );

        const userTyped = '2024-10-01';
        const expectedLeftText = '2024-10-01';
        const expectedRightText = '2024-10-01';
        const expectedReturnedDate = '2024-10-01';

        await fireEvent.input(dueDateInput, { target: { value: userTyped } });

        expect(dueDateInput.value).toEqual(expectedLeftText);
        expect(dueDateFromDateEditorInput.value).toEqual(expectedReturnedDate);
        expect(parsedDateFromDateEditor.value).toEqual(expectedRightText);
    });

    it('should replace an empty date field with typed abbreviation', async () => {
        const { container } = renderDateEditorWrapper();
        const dueDateInput = getAndCheckRenderedElement<HTMLInputElement>(container, 'due');
        const dueDateFromDateEditorInput = getAndCheckRenderedElement<HTMLInputElement>(
            container,
            'dueDateFromDateEditor',
        );
        const parsedDateFromDateEditor = getAndCheckRenderedElement<HTMLInputElement>(
            container,
            'parsedDateFromDateEditor',
        );

        await fireEvent.input(dueDateInput, { target: { value: 'tm ' } });

        expect(dueDateInput.value).toEqual('tomorrow');
        expect(dueDateFromDateEditorInput.value).toEqual('tomorrow');
        expect(parsedDateFromDateEditor.value).toEqual('2024-04-21');
    });
});
