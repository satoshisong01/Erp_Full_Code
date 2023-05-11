import React from "react";
import { Msg } from "../../i18n";

export default class RecentProjects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: []
    };

  }

  getList(title) {
    const arr1 = [
        { href: "/", title: "프로젝트 등록" },
        { href: "/", title: "재료비 내역" },
        { href: "/", title: "개별 외주비 내역" },
        { href: "/", title: "월별 인건비 계획" },
        { href: "/", title: "경비 내역(관리자)" },
        { href: "/", title: "경비 내역(사용자)" },
        { href: "/", title: "급별 단가(경비/인건비) 내역" },
        { href: "/", title: "사전원가지표" }
    ]
    const arr2 = [
        { href: "/", title: "거래처 관리" },
        { href: "/", title: "공통코드관리1" },
        { href: "/", title: "공통코드관리2" },
        { href: "/", title: "메뉴 관리" },
        { href: "/", title: "사용자 관리" },
        { href: "/", title: "에러로그 관리" },
        { href: "/", title: "급별 단가(경비/인건비) 내역" },
    ]
    title === '사전원가'? this.setState({ projects: arr1 }) :  this.setState({ projects: arr2 })
  }


  componentDidMount() {
    this.getList(this.props.title)
  }
  clearProjects = () => {
    this.setState({
      projects: []
    });
  };
  render() {
    let projects = this.state.projects;
    return (
      <div className="project-context hidden-xs dropdown">
        <span
          className="project-selector dropdown-toggle"
          data-toggle="dropdown"
        >
          <Msg phrase={ this.props.title } />
          {/* {projects.length ? <i className="fa fa-angle-down" /> : null} */}
        </span>

        {projects.length ? (
          <ul className="dropdown-menu">
            {projects.map(function(project, idx) {
              return (
                <li key={idx}>
                  <a href={project.href}>{project.title}</a>
                </li>
              );
            })}

            {/* <li className="divider" />
            <li>
              <a href="#/" onClick={this.clearProjects}>
                <i className="fa fa-power-off" /> Clear
              </a>
            </li> */}
          </ul>
        ) : null}
      </div>
    );
  }
}
