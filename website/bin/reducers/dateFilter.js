import { FILTER_EVENT_DATE, DateFilterKind} from '../actions/index';

const dateFilter = (state = DateFilterKind.M1, action) => {
  switch (action.type) {
    case FILTER_EVENT_DATE:
      return action.kind
    default:
      return state
  }
}

export default dateFilter