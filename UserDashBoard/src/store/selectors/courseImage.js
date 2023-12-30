import { courseState } from "../atoms/course";
import { selector } from "recoil";

export const courseImage = selector({
    key: 'courseImage',
    get: ({ get }) => {
        const state = get(courseState);
        if (state.course) {
            return state.course.imageLink;
        } else {
            return "";
        }
    }
});
