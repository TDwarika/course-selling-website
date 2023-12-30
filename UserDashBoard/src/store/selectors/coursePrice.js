import { courseState } from "../atoms/course";
import { selector } from "recoil";
export const coursePrice = selector({
    key: 'coursePrice',
    get: ({ get }) => {
        const state = get(courseState);
        if(state.course)
        return state.course.price;
        else
        return "";
    }
})