import Vue from "vue";
import Vuex from "vuex";
import {playMode} from 'js/config';
import {shuffle} from 'js/util';
import {
  saveSearch,
  loadSearch,
  deleteSearch,
  clearSearch,
  savePlay,
  loadPlay,
  loadFavorite,
  saveFavorite,
  deleteFavorite
} from 'js/cache';

Vue.use(Vuex);

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id;
  });
}

export default new Vuex.Store({
  state: {
    singer: {},
    playing: false,
    fullScreen: false,
    playlist: [],
    sequenceList: [],
    mode: playMode.sequence,
    currentIndex: -1,
    disc: {},
    topList: {},
    searchHistory: loadSearch(),
    playHistory: loadPlay(),
    favoriteList: loadFavorite()
  },
  mutations: {
    SET_SINGER(state, singer) {
      state.singer = singer;
    },
    SET_PLAYING_STATE(state, playing) {
      state.playing = playing;
    },
    SET_FULL_SCREEN(state, fullScreen) {
      state.fullScreen = fullScreen;
    },
    SET_PLAYLIST(state, playlist) {
      state.playlist = playlist;
    },
    SET_SEQUENCE_LIST(state, sequenceList) {
      state.sequenceList = sequenceList;
    },
    SET_MODE(state, mode) {
      state.mode = mode;
    },
    SET_CURRENT_INDEX(state, currentIndex) {
      state.currentIndex = currentIndex;
    },
    SET_DISC(state, disc) {
      state.disc = disc;
    },
    SET_TOP_LIST(state, topList) {
      state.topList = topList;
    },
    SET_SEARCH_HISTORY(state, searchHistory) {
      state.searchHistory = searchHistory;
    },
    SET_PLAY_HISTORY(state, playHistory) {
      state.playHistory = playHistory;
    },
    SET_FAVORITE_LIST(state, list) {
      state.favoriteList = list;
    }
  },
  getters: {
    singer: state => state.singer,
    playing: state => state.playing,
    fullScreen: state => state.fullScreen,
    playlist: state => state.playlist,
    sequenceList: state => state.sequenceList,
    mode: state => state.mode,
    currentIndex: state => state.currentIndex,
    currentSong: (state) => {
      return state.playlist[state.currentIndex] || {}
    },
    disc: state => state.disc,
    topList: state => state.topList,
    searchHistory: state => state.searchHistory,
    playHistory: state => state.playHistory,
    favoriteList: state => state.favoriteList
  },
  actions: {
    selectPlay({commit, state}, {list, index}) {
      commit('SET_SEQUENCE_LIST', list);
      if (state.mode === playMode.random) {
        let randomList = shuffle(list);
        commit('SET_PLAYLIST', randomList);
        index = findIndex(randomList, list[index]);
      } else {
        commit('SET_PLAYLIST', list);
      }
      commit('SET_CURRENT_INDEX', index);
      commit('SET_FULL_SCREEN', true);
      commit('SET_PLAYING_STATE', true);
    },
    randomPlay({commit}, {list}) {
      commit('SET_MODE', playMode.random);
      commit('SET_SEQUENCE_LIST', list);
      let randomList = shuffle(list);
      commit('SET_PLAYLIST', randomList);
      commit('SET_CURRENT_INDEX', 0);
      commit('SET_FULL_SCREEN', true);
      commit('SET_PLAYING_STATE', true);
    },
    insertSong({commit, state}, song) {
      let playlist = state.playlist.splice();
      let sequenceList = state.sequenceList.splice();
      let currentIndex = state.currentIndex;
      // 记录当前歌曲
      let currentSong = playlist[currentIndex];
      // 查找播放列表中是否已存在插入的歌曲，并返回其索引
      let fpIndex = findIndex(playlist, song);
      // 插入歌曲，索引需要 + 1
      currentIndex++;
      // 插入这首歌到当前索引位置
      playlist.splice(currentIndex, 0, song);
      // 如果存在该首歌
      if (fpIndex > -1) {
        // 如果当前插入的序号大于列表中的序号
        if (currentIndex > fpIndex) {
          playlist.split(fpIndex, 1);
          currentIndex--;
        } else {
          playlist.splice(fpIndex + 1, 1);
        }
      }
      let currentSIndex = findIndex(sequenceList, currentSong) + 1;
      let fsIndex = findIndex(sequenceList, song);
      sequenceList.splice(currentSIndex, 0, song);
      if (fsIndex > -1) {
        if (currentSIndex > fsIndex) {
          sequenceList.splice(fsIndex, 1);
        } else {
          sequenceList.splice(fsIndex + 1, 1);
        }
      }
      commit('SET_PLAYLIST', playlist);
      commit('SET_SEQUENCE_LIST', sequenceList);
      commit('SET_CURRENT_INDEX', currentIndex);
      commit('SET_FULL_SCREEN', true);
      commit('SET_PLAYING_STATE', true);
    },
    saveSearchHistory({commit}, query) {
      commit('SET_SEARCH_HISTORY', saveSearch(query));
    },
    deleteSearchHistory({commit}, query) {
      commit('SET_SEARCH_HISTORY', deleteSearch(query));
    },
    clearSearchHistory({commit}) {
      commit('SET_SEARCH_HISTORY', clearSearch());
    },
    deleteSong({commit, state}, song) {
      let playlist = state.playlist.slice();
      let sequenceList = state.sequenceList.slice();
      let currentIndex = state.currentIndex;
      let pIndex = findIndex(playlist, song);
      playlist.splice(pIndex, 1);
      let sIndex = findIndex(sequenceList, song);
      sequenceList.splice(sIndex, 1);
      if (currentIndex > pIndex || currentIndex === playlist.length) {
        currentIndex--;
      }

      commit('SET_PLAYLIST', playlist);
      commit('SET_SEQUENCE_LIST', sequenceList);
      commit('SET_CURRENT_INDEX', currentIndex);

      if (!playlist.length) {
        commit('SET_PLAYING_STATE', false);
      } else {
        commit('SET_PLAYING_STATE', true);
      }
    },
    deleteSongList({commit}) {
      commit('SET_PLAYLIST', []);
      commit('SET_SEQUENCE_LIST', []);
      commit('SET_CURRENT_INDEX', -1);
      commit('SET_PLAYING_STATE', false);
    },
    savePlayHistory({commit}, song) {
      commit('SET_PLAY_HISTORY', savePlay(song));
    },
    saveFavoriteList({commit}, song) {
      commit('SET_FAVORITE_LIST', saveFavorite(song));
    },
    deleteFavoriteList({commit}, song) {
      commit('SET_FAVORITE_LIST', deleteFavorite(song));
    }
  }
});
