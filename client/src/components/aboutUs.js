import React, {Component} from 'react'
import WorldIcon from '../images/world.png'
import './aboutUs.css';

class Collapsible extends React.Component {
  constructor(props){
      super(props);
      this.state = {
          open: false
      }
      this.toggle = this.toggle.bind(this);
  }

  toggle(e){
      this.setState({open: !this.state.open})
  }

  render() {
    return (<div>
      <div onClick={(e)=>this.toggle(e)} className='header'>
      &#8595; {this.props.title}</div>
      {this.state.open ? (
          <div className='content'>
              {this.props.children}
          </div>
          ) : null}
    </div>);
  }
}

const About = () => {

  return (
    <div className = "container">
      <h1 style = {{paddingTop: '50px', textAlign: "center"}}>Invest-Ed Data Visualization Tool</h1>
      <br></br>
      <Collapsible title="Girls’ and Women’s Education Initiatives in Asia Supported by Private Foundations and Impact Investing Organisations (About)"><p>
      This platform visualises data on girls’ and women’s education initiatives in Asia supported by private foundations and private-sector impact investing organisations.
      The sub-sample of initiatives and financers presented here is extracted from the larger original regional Invest-ED Database on non-state private financers of education in
      East Asia and the Pacific and South Asia.<br></br><br></br>
      The Invest-ED Database includes publicly available data on a range of non-state private financers of education, their co-financing and implementing partners, and funded education initiatives.
      The non-state private financers in the database were extracted from five global and regional sources.<br></br><br></br>
      Education initiatives that were operational in 2015, 2016, or 2017 are included. They may have started
      before or ended after these years.<br></br><br></br>
      The Invest-ED Database has data on the geographic concentrations of activity, education sub-sectors, programming areas, and activities. Only initiatives with an explicit focus on girls’ and
      women’s education are included in the data visualization platform here.<br></br><br></br>
      We are interested in expanding the database. If you are a financer or implementing partner of education initiatives in Asia and/or if there are data here that require updating, please contact us.<br></br><br></br>
      </p></Collapsible>
      <br></br><br></br>
      <Collapsible title="The Invest-Ed Database Project Team (Past and Current Members)">
      <b>Director and Principal Investigator</b>
      <p>Dr. Prachi Srivastava, Associate Professor, University of Western Ontario E: prachi.sivastava@uwo.ca Twitter: @prachisrivas www.prachisrivastava.com</p><br></br>
      <b>Research Fellow</b>
      <p>Dr. Robyn Read</p><br></br>
      <b>Invest-ED Research Assistants</b>
      <p>Deanna Matthews, Eliana Rosenblum, Rajender Singh, Daphne Varghese</p><br></br>
      <b>Data Visualization Team</b>
      <p>Connor Cozens, Marlin Manka, Justin Marshall, Leopoldine Vassiliou</p>
      </Collapsible>
      <br></br><br></br>
      <Collapsible title="Financial Support">
      <p>The Invest-ED Database was developed as part of larger research program on non-state private actors supported by an Insight Grant (2012-19) from
      the Social Sciences and Humanities Research Council of Canada (Principal Investigator, Srivastava). Parts of the project were supported with co-funding
      from the Brookings Institution.</p>
      </Collapsible>
      <br></br><br></br>
      <Collapsible title="Publications">
      <p>Data are being analysed and further publications are in process. They will be added here as they become available.</p><br></br>
      <p>Srivastava, P., & Read, R. (2020). New education finance: Exploring impact investment, networks, and market-making in South Asia. In, P. Sarangapani & R. Pappu (Eds.),
      Handbook of education systems in South Asia. Global Education Systems Series. Singapore: Springer. https://doi.org/10.1007/978-981-13-3309-5_24-1</p><br></br>
      <p>Matthews, D., & Srivastava, P. (2019). Canada’s Feminist International Assistance Policy and private sector engagement in education: Considering action for
      girls’ and women’s education in Asia. Policy Brief, Global Affairs Canada—SSHRC International Policy Ideas Challenge 2019. London, ON: University of Western
      Ontario. https://ir.lib.uwo.ca/edupub/161/</p><br></br>
      <p>Srivastava, P., & Read, R. (2019). Philanthropic and impact investors: private sector engagement, hybridity and the problem of definition. In, N. Ridge & A.
      Terway (Eds.), Philanthropy in education: diverse perspectives and global trends, pp. 15-36. Cheltenham, UK: Edward Elgar.
      https://doi.org/10.4337/9781789904123.00010</p><br></br>
      <p>Srivastava, P., & Read, R. (2019). Towards transparency: A report on piloting the Invest-ED tool on private sector investment in education with philanthropic
      and impact investing actors in Asia. Western University/Brookings Institution, 2019, pp. 63. https://ir.lib.uwo.ca/edupub/109/</p><br></br>
      <p>Srivastava, P., & Read, R. (2018). The landscape for philanthropy in Asia: focus on India. Brief prepared for the Roundtable on Philanthropy and CSR support
      for the Right to Education Act. Philanthropy and Education, NORRAG, New Delhi, 27 April 2018.</p><br></br>
      </Collapsible>
      <br></br><br></br>
    </div>
  );
}

export default About