const state = {
  selectedGroupID: undefined
};

const mutations = {
  setSelectedGroupID(state, id) {
    state.selectedGroupID = id;
  },
}

export default {
  state,
  mutations
};
