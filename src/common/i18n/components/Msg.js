import React from "react";

import { connect } from "react-redux";

/**
 * span 태그로 문자열 표시 또는 언어팩 적용
 * phrases가 있다면 phrases 표현
 * i18nReducer의 phrases[key]가 있다면 phrases[key]로 표현
 */
class Msg extends React.Component {
  render() {
    const key = this.props.phrase; //사전원가
    const phrase = this.props.phrases[key] || key; //undefined
    return <span style={{alignSelf:'center'}}>{phrase}</span>;
    // return <span>{phrase}</span>;
  }
}

const mapStateToProps = state => state.i18n;

export default connect(mapStateToProps)(Msg);
