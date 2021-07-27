const constants = {
  smoothy: {
    appVersion: "0.1.0",
    os: "web",
    openchatHost: process.env.REACT_APP_MODE === "development"?"https://dev.smoothy.co/":"https://smoothy.co/",
    openchatPath: "ch/",
    auth: {
      rememberMe: "smoothy-web-remember-me", // localStorage key
    },
    images: {
      ufo: process.env.PUBLIC_URL + "/images/ufo_full@3x.png",
      ufoSvg: process.env.PUBLIC_URL + "/images/ic-launcher-googleplay.svg",
      menuSetting: process.env.PUBLIC_URL + "/images/ic-menu-setting.svg",
      toolbar: {
        cameraOn:
          process.env.PUBLIC_URL +
          "/images/toolbar/ic_chatroom_toolbar_camera_on.svg",
        cameraOff:
          process.env.PUBLIC_URL +
          "/images/toolbar/ic_chatroom_toolbar_camera_off.svg",
        exitRoom:
          process.env.PUBLIC_URL +
          "/images/toolbar/ic_chatroom_toolbar_exitroom.svg",
        micOn:
          process.env.PUBLIC_URL +
          "/images/toolbar/ic_chatroom_toolbar_mic_on.svg",
        micOff:
          process.env.PUBLIC_URL +
          "/images/toolbar/ic_chatroom_toolbar_mic_off.svg",
        config:
          process.env.PUBLIC_URL +
          "/images/toolbar/ic_chatroom_toolbar_watchparty_config.svg",
        watchParty:
          process.env.PUBLIC_URL +
          "/images/toolbar/ic_chatroom_toolbar_watchparty.svg",
        effectSelected:
          process.env.PUBLIC_URL +
          "/images/toolbar/ic_chatroom_toolbar_effect_selected.svg",
        effect:
          process.env.PUBLIC_URL +
          "/images/toolbar/ic_chatroom_toolbar_effect.svg",
        memberCount:
          process.env.PUBLIC_URL +
          "/images/toolbar/ic_chatroom_membercount.svg",
        shareChatlink:
          process.env.PUBLIC_URL +
          "/images/toolbar/ic_chatroom_share_chatlink.svg",
      },
      effect: {
        reactClose:
          process.env.PUBLIC_URL +
          "/images/effect/ic_chatroom_toolbar_reaction_close.png",
        reaction001:
          process.env.PUBLIC_URL +
          "/images/effect/ic-effect-reaction-001-floatingsticker-redheart.png",
        reaction002:
          process.env.PUBLIC_URL +
          "/images/effect/ic-effect-reaction-002-floatingsticker-fire.png",
        reaction003:
          process.env.PUBLIC_URL +
          "/images/effect/ic-effect-reaction-003-floatingsticker-likepack.png",
        reaction004:
          process.env.PUBLIC_URL +
          "/images/effect/ic-effect-reaction-004-floatingsticker-bombpack.png",
        reaction005:
          process.env.PUBLIC_URL +
          "/images/effect/ic-effect-reaction-005-floatingsticker-singpack.png",
        reaction006:
          process.env.PUBLIC_URL +
          "/images/effect/ic-effect-reaction-006-floatingsticker-colorheartpack.png",
        reaction007:
          process.env.PUBLIC_URL +
          "/images/effect/ic-effect-reaction-007-floatingsticker-sweetpack.png",
        reaction008:
          process.env.PUBLIC_URL +
          "/images/effect/ic-effect-reaction-008-floatingsticker-monpack.png",
        reaction009:
          process.env.PUBLIC_URL +
          "/images/effect/ic-effect-reaction-009-fullscreen-thundervolt.png",
        reaction010:
          process.env.PUBLIC_URL +
          "/images/effect/ic-effect-reaction-010-fullscreen-lovelove.png",
        reaction011:
          process.env.PUBLIC_URL +
          "/images/effect/ic-effect-reaction-011-fullscreen-shakeshake.png",
        reaction012:
          process.env.PUBLIC_URL +
          "/images/effect/ic-effect-reaction-012-eachscreen-hammer.png",
        reaction013:
          process.env.PUBLIC_URL +
          "/images/effect/ic-effect-reaction-013-fullscreen-confettie.png",
        reaction014:
          process.env.PUBLIC_URL +
          "/images/effect/ic-effect-reaction-014-fullscreen-starbomb.png",
        reaction015:
          process.env.PUBLIC_URL +
          "/images/effect/ic-effect-reaction-015-fullscreen-flowerrain.png",
        reaction016:
          process.env.PUBLIC_URL +
          "/images/effect/ic-effect-reaction-016-fullscreen-kkkk.png",
        reaction017:
          process.env.PUBLIC_URL +
          "/images/effect/ic-effect-reaction-017-fullscreen-gloomyrain.png",
        reaction021:
          process.env.PUBLIC_URL +
          "/images/effect/ic-effect-reaction-021-floatingsticker-bats.png",
        reaction022:
          process.env.PUBLIC_URL +
          "/images/effect/ic-effect-reaction-022-floatingstsicker-halloweenpack.png",
        reaction023:
          process.env.PUBLIC_URL +
          "/images/effect/ic-effect-reaction-023-fullscreen-halloweenweb.png",
        reaction024:
          process.env.PUBLIC_URL +
          "/images/effect/ic-effect-reaction-024-fullscreen-snow.png",
        reaction025:
          process.env.PUBLIC_URL +
          "/images/effect/ic-effect-reaction-025-fullscreen-fireworks.png",
        reaction026:
          process.env.PUBLIC_URL +
          "/images/effect/ic-effect-reaction-026-floatingsticker-snow.png",
        reaction027:
          process.env.PUBLIC_URL +
          "/images/effect/ic-effect-reaction-027-floatingsticker-xmas.png",
        reaction028:
          process.env.PUBLIC_URL +
          "/images/effect/ic-effect-reaction-028-floatingsticker-deliveryfood.png",
        reaction029:
          process.env.PUBLIC_URL +
          "/images/effect/ic-effect-reaction-029-floatingsticker-money.png",
        reaction030:
          process.env.PUBLIC_URL +
          "/images/effect/ic-effect-reaction-030-fullscreen-goldconfetti.png",
        reaction031:
          process.env.PUBLIC_URL +
          "/images/effect/ic-effect-reaction-031-fullscreen-realmoneyrain.png",
      },
      youtubue: {
        exit:
          process.env.PUBLIC_URL +
          "/images/assets_30_watchparty_player_2021-05-13/ic_watchparty_exit.svg",
        fullscreenHorizontal:
          process.env.PUBLIC_URL +
          "/images/assets_30_watchparty_player_2021-05-13/ic_watchparty_fullscreen_horizontal.svg",
        playerNext:
          process.env.PUBLIC_URL +
          "/images/assets_30_watchparty_player_2021-05-13/ic_watchparty_player_next.svg",
        playerNextDisabled:
          process.env.PUBLIC_URL +
          "/images/assets_30_watchparty_player_2021-05-13/ic_watchparty_player_next_disabled.svg",
        playerPlay:
          process.env.PUBLIC_URL +
          "/images/assets_30_watchparty_player_2021-05-13/ic_watchparty_player_play.svg",
        playerPrevious:
          process.env.PUBLIC_URL +
          "/images/assets_30_watchparty_player_2021-05-13/ic_watchparty_player_previous.svg",
        playerPreviousDisabled:
          process.env.PUBLIC_URL +
          "/images/assets_30_watchparty_player_2021-05-13/ic_watchparty_player_previous_disabled.svg",
        playerStop:
          process.env.PUBLIC_URL +
          "/images/assets_30_watchparty_player_2021-05-13/ic_watchparty_player_stop.svg",
        playList:
          process.env.PUBLIC_URL +
          "/images/assets_30_watchparty_player_2021-05-13/ic_watchparty_playlist.svg",
        smallScreen:
          process.env.PUBLIC_URL +
          "/images/assets_30_watchparty_player_2021-05-13/ic_watchparty_smallscreen.svg",
        watchPartySmoothyMon:
          process.env.PUBLIC_URL +
          "/images/watch_party/img_watchparty_youtubemon.svg",
      },
      appDrawer: {
        settingId:
          process.env.PUBLIC_URL + "/images/app_drawer/ic_setting_id.svg",
        settingNickname:
          process.env.PUBLIC_URL + "/images/app_drawer/ic_setting_nickname.svg",
        settingGoogle:
          process.env.PUBLIC_URL + "/images/app_drawer/ic_setting_google.svg",
        settingFacebook:
          process.env.PUBLIC_URL + "/images/app_drawer/ic_setting_facebook.svg",
        settingKakaotalk:
          process.env.PUBLIC_URL +
          "/images/app_drawer/ic_setting_kakaotalk.svg",
        settingApple:
          process.env.PUBLIC_URL + "/images/app_drawer/ic_setting_apple.svg",
        settingVersion:
          process.env.PUBLIC_URL + "/images/app_drawer/ic_setting_version.svg",
        settingHelp:
          process.env.PUBLIC_URL + "/images/app_drawer/ic_setting_help.svg",
        settingLink:
          process.env.PUBLIC_URL + "/images/app_drawer/ic_setting_link.svg",
        settingFeedback:
          process.env.PUBLIC_URL + "/images/app_drawer/ic_setting_feedback.svg",
        settingLogout:
          process.env.PUBLIC_URL + "/images/app_drawer/ic_setting_logout.svg",
        settingDeleteaccount:
          process.env.PUBLIC_URL + "/images/app_drawer/ic_setting_deleteaccount.svg",
      },
    },
    device: {
      id: "smoothy-web-device-id", // localStorage key
    },
    notification: {
      type: {
        forceJoin: "force_join",
        ping: "ping",
      },
      party: {
        current: "current",
      },
    },
    zidx: {
      toolbar: 40,
      blocking: 30,
      btn: 15,
      view: 0,
    },
    latency: {
      youtube: {
        player: 100,
      },
    },
    registration: {
      push: {
        scope: "/firebase-cloud-messaging-push-scope",
      },
    },
    error: {
      login_failed_firebase_auth_creation_error: {
        id: "login_failed_firebase_auth_creation_error",
        description: "파이어베이스 Auth 생성 또는 연결 실패",
        msg: "계정 생성 또는 정보 연결에 문제가 생겼어요. 잠시 후 다시 시도해주세요",
      },
      login_failed_google_credential_error: {
        id: "login_failed_google_credential_error",
        description: "구글 > 토큰 또는 Credential이 없는 에러",
        msg: "구글 인증 정보를 받아오는데 문제가 생겼어요. 잠시 후 다시 시도해 주세요",
      },
      login_failed_google_firebase_auth_creation_error: {
        id: "login_failed_google_firebase_auth_creation_error",
        description: "구글 > 파이어베이스 Auth 생성 또는 연결 실패",
        msg: "구글 계정 생성 또는 정보 연결에 문제가 생겼어요. 잠시 후 다시 시도해주세요",
      },
      login_failed_facebook_credential_error: {
        id: "login_failed_facebook_credential_error",
        description: "페이스북 > 파이어베이스 Auth 생성 또는 연결 실패",
        msg: "페이스북 인증 정보를 받아오는데 문제가 생겼어요. 잠시 후 다시 시도해주세요",
      },
      login_failed_facebook_firebase_auth_creation_error: {
        id: "login_failed_google_facebook_auth_creation_error",
        description: "페이스북 > 파이어베이스 Auth 생성 또는 연결 실패",
        msg: "페이스북 계정 생성 또는 정보 연결에 문제가 생겼어요. 잠시 후 다시 시도해주세요.",
      },
      username_failed_get_profile_failure: {
        id: "username_failed_get_profile_failure",
        description:
          "로그인 성공 후 > 유저네임 체크에러 > 파이어베이스에서 값을 받아오지 못한 에러",
        msg: "사용자 프로필 조회에 실패했어요. 네트워크 상태를 확인하거나 잠시 후 시도해주세요",
      },
      fail_to_create_new_chat: {
        id: "fail_to_create_new_chat",
        description: "새로운 파티 생성에 실패함",
        msg: "새 통화를 생성하는데 실패했습니다. 잠시 후 다시 시도 해 주세요",
      },
    },
  },
  videoChat: {
    mode: {
      eachScreenAndHammerMode: "each-screen-hammer-mode",
    },
    components: {
      container: "media-container",
      subContainer: "multi-media-container",
      individual: {
        view: "individual-view-container",
      },
    },
    from: {
      openchat: "openchat",
    },
  },
  twilio: {
    videoChat: {
      layout: {
        wrapperDiv: "twilio-layout-wrapper-div",
      },
    },
  },
  reaction: {
    eachscreen: {
      hammer: {
        img: "012_eachscreen_hammer",
        aud: "hitsound",
      },
    },
    fullscreen: {
      shakeshake: "011_fullscreen_shakeshake",
    },
  },
  animation: {
    wiggle: "wiggle-active",
    buttonClicked: "button-clicked-animation",
  },
  youtube: {
    control: {
      play: "play",
      pause: "pause",
    },
    player: {
      state: {
        initial: -1,
        ended: 0,
        playing: 1,
        paused: 2,
        buffering: 3,
        cued: 5,
      },
    },
  },
};

export default constants;
