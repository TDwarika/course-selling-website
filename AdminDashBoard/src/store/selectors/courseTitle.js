import { courseState } from "../atoms/course";
import { selector } from "recoil";
export const courseTitle = selector({
    key: 'courseTitle',
    get: ({ get }) => {
        const state = get(courseState);
        if(state.course)
        return state.course.title;
        else
        return "";
    }
})

