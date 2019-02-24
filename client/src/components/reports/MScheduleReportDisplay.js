import React from 'react';
import {
  Table,
  Container, Row, Col,
  Button
 } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import '../../styles.css'
import { exportIngDepReport } from '../../actions/exportActions';
import 'jspdf-autotable';
import * as jsPDF from 'jspdf';

class MScheduleReportDisplay extends React.Component {
  constructor(props){
    super(props);
  }

  getPercent = (duration, actual_duration) => {
    return (Math.floor((duration/actual_duration) * 100) + "%");
  }

  exportPDF = (report, e) => {
    var doc = new jsPDF('l', 'pt');
    console.log(doc.getFontSize());
    var docPos = 40;
    doc.text(20, 40, "Manufacturing Schedule Report");
    docPos = 60;
    doc.setFontSize(14);
    doc.text(20, 60, "Manufacturing Tasks");
    docPos = 70;
    var sku;
    var sku_res;
    var formula;
    var formula_res;
    var ing;
    var ing_res;
    console.log(report);
    doc.setFontSize(11);
    report.activities.map(function({name, sku,start, duration,
      actual_duration, actual_start, actual_end}, i){
        doc.text(20, docPos, (i+1)+". " + name);
        docPos = docPos + 10;
        doc.text(20, docPos, "Start: " + actual_start);
        docPos = docPos + 10;
        doc.text(20, docPos, "End: " + actual_end);
        docPos = docPos + 10;
        var percent = "";
        if(actual_duration !== duration){
          percent = " (" + Math.floor((duration/actual_duration) * 100) + "%)";
        }
        doc.text(20, docPos, "Duration: " + actual_duration + percent);
        docPos = docPos + 10;
        doc.text(20, docPos, "SKU: ");
        docPos = docPos + 10;
        sku = document.getElementById("sku_toPDF" + i)
        sku_res = doc.autoTableHtmlToJson(sku);
        if(sku_res){
          doc.autoTable(sku_res.columns, sku_res.data, { margin: { top: 10, left: 20, right: 20, bottom: 50 }, startY: docPos});
          docPos = doc.autoTableEndPosY() + 10;
        }
        doc.text(20, docPos, "Formula: ");
        docPos = docPos + 10;
        formula = document.getElementById("formula_toPDF" + i)
        formula_res = doc.autoTableHtmlToJson(formula);
        if(formula_res){
          doc.autoTable(formula_res.columns, formula_res.data, { margin: { top: 10, left: 20, right: 20, bottom: 50 }, startY: docPos});
          docPos = doc.autoTableEndPosY() + 10;
        }
        doc.text(20, docPos, "Ingredients");
        docPos = docPos + 10;
        ing = document.getElementById("ing_toPDF" + i)
        ing_res = doc.autoTableHtmlToJson(ing);
        if(ing_res){
          doc.autoTable(ing_res.columns, ing_res.data, { margin: { top: 10, left: 20, right: 20, bottom: 50 }, startY: docPos});
          docPos = doc.autoTableEndPosY() + 20;
        }
        });

    doc.setFontSize(14);
    doc.text(20, docPos + 10, "Ingredients Needed");
    docPos = docPos + 20;
    var ingSum = document.getElementById("ing_summary_toPDF")
    var ingSum_res = doc.autoTableHtmlToJson(ingSum);
    if(ingSum_res)
      doc.autoTable(ingSum_res.columns, ingSum_res.data, { margin: { top: 10, left: 20, right: 20, bottom: 50 }, startY: docPos});
    doc.save('schedule_report.pdf'); //Download the rendered PDF.
  }

  render() {
    const report = this.props.schedule.report;
    if(Object.keys(report).length > 0){
      return (
        <div>
          <Container>
            <h1>Manufacturing Schedule Report</h1>
            <h3>Manufacturing Tasks</h3>
            {report.activities.map(({_id, name, sku,start, duration,
              actual_duration, actual_start, actual_end}, i) => (
                <div key={_id}>
                  <h5>{i + 1}. {name}</h5>
                  <div>
                    <b>Start: </b>{actual_start}
                  </div>
                  <div>
                    <b>End: </b>{actual_end}
                  </div>
                  <div>
                    <b>Duration: </b> {actual_duration}
                      {actual_duration !== duration &&
                        <em> ({this.getPercent(duration,actual_duration)})</em>}
                  </div>
                  {[sku].map(({_id, name, number, case_number, unit_number, unit_size,
                  count_per_case, formula, formula_scale_factor, manufacturing_rate})=>(
                    <div key={_id}>
                      <div>
                        <b>SKU:</b>
                          <Table id={"sku_toPDF" + i} responsive size="sm">
                            <thead>
                              <tr>
                                <th title="Name">Name</th>
                                <th title="SKU#">SKU#</th>
                                <th title="Case UPC#">Case UPC#</th>
                                <th title="Unit UPC#">Unit UPC#</th>
                                <th title="Unit Size">Unit Size</th>
                                <th title="Count/Case">Count/Case</th>
                                <th title="Formula">Formula</th>
                                <th title="Formula Scale Factor">Formula Scale Factor</th>
                                <th title="Manufacturing Rate">Manufacturing Rate</th>
                              </tr>
                            </thead>
                            <tbody>
                                  <tr>
                                    <td> {name} </td>
                                    <td> {number} </td>
                                    <td> {case_number} </td>
                                    <td> {unit_number} </td>
                                    <td> {unit_size} </td>
                                    <td> {count_per_case}</td>
                                    <td> {formula.name}</td>
                                    <td> {formula_scale_factor}</td>
                                    <td> {manufacturing_rate}</td>
                                  </tr>
                            </tbody>
                          </Table>
                      </div>
                      <div key={formula._id}>
                        <b>Formula:</b>
                          <Table id={"formula_toPDF"+i} responsive size="sm">
                            <thead>
                              <tr>
                                <th title="Name">Name</th>
                                <th title="#">#</th>
                                <th title="Ingredients List">Ingredients List</th>
                              </tr>
                            </thead>
                            <tbody>
                                  <tr>
                                    <td> {formula.name} </td>
                                    <td> {formula.number} </td>
                                    <td> {
                                      formula.ingredients_list.map(({_id, quantity}) => (
                                        <div key={_id._id}> {_id.name}, {quantity}</div>
                                      ))
                                    } </td>
                                  </tr>
                            </tbody>
                          </Table>
                      </div>
                      <div>
                        <b>Ingredients:</b>
                          <Table id={"ing_toPDF"+i} responsive size="sm">
                            <thead>
                              <tr>
                                <th title="Name">Name</th>
                                <th title="Ingr#">Ingr#</th>
                                <th title="Vendor Info">Vendor Info</th>
                                <th title="Package Size">Package Size</th>
                                <th title="Cost Per Package">Cost Per Package</th>
                              </tr>
                            </thead>
                            <tbody>
                              {formula.ingredients_list.map(({_id}) => (
                                <tr key={_id._id}>
                                  <td> {_id.name} </td>
                                  <td> {_id.number} </td>
                                  <td> {_id.vendor_info} </td>
                                  <td> {_id.package_size} </td>
                                  <td> {_id.cost_per_package} </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              {report.activities.length === 0 && <div>No Manufacturing Tasks</div>}
            <h3>Ingredients Needed</h3>
            {report.ingredients.length > 0 &&
              <Table id="ing_summary_toPDF" responsive size="sm">
                <thead>
                  <tr>
                    <th title="Ingredient">Ingredient</th>
                    <th title="Quantity">Quantity</th>
                    <th title="Packages">Packages</th>
                  </tr>
                </thead>
                <tbody>
                  {report.ingredients.map(({ingredient, quantity, packages}) => (
                    <tr key={ingredient._id}>
                      <td> {ingredient.name} </td>
                      <td> {quantity} </td>
                      <td> {packages} </td>
                    </tr>
                  ))}
                </tbody>
              </Table>}

            {report.ingredients.length === 0 && <div>No Ingredients</div>}
            <Row>
               <Col style={{'textAlign': 'right'}}/>
               <Button onClick={this.exportPDF.bind(this, report)}>PDF</Button>
            </Row>
          </Container>
        </div>
      );
    }
    else{
      return (
        <div style={{textAlign: 'center'}}>
          <h2>No reports generated</h2>
          Go to the <a href="./manufacturingschedule"> Manufacturing Schedule Page </a> to
          generate an Manufacturing Schedule Report
        </div>
      );
    }
  }
}

MScheduleReportDisplay.propTypes = {
  exportIngDepReport: PropTypes.func.isRequired,
  schedule: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  schedule: state.schedule
});

export default connect(mapStateToProps, { exportIngDepReport} )(MScheduleReportDisplay);
