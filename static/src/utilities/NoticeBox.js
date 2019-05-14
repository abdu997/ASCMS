import React from 'react';

/**
 * Renders the NoticeBox element to be used through out the app.
 *
 * @extends React
 */
class NoticeBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  /**
   * Builds the NoticeBox by concatenating values from the Message props.
   * Inserts the status and message of the array into the element.
   *
   * @return {string} NoticeBox
   */
  render() {
    if(this.props.Message){
      return (
        <div className="notice-box">
          <table>
            <tbody>
              <tr>
                <td>
                  <i className={"fa notice-icon " + (this.props.Message.status === "error" ? "fa-times-circle" : "fa-check-circle")}></i>
                </td>
                <td className="notice-message capitalize">
                  {this.props.Message.message}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    } else {
      return (
        <div></div>
      );
    }
  }
}
export default NoticeBox;
