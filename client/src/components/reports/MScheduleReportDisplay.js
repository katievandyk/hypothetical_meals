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

  exportPDF = (report) => {
    var sku = document.getElementById("sku_toPDF")
    console.log(sku);
    var doc = new jsPDF('l', 'pt');
    doc.text(20, 40, "Manufacturing Schedule Report");
    var sku_res = doc.autoTableHtmlToJson(sku);
    if(sku_res)
      doc.autoTable(sku_res.columns, sku_res.data, { margin: { top: 50, left: 20, right: 20, bottom: 0 }});
    doc.save('schedule_report.pdf'); //Download the rendered PDF.
  }

  render() {
    const report_actual = this.props.schedule.report;
    console.log(report_actual);
    const report = {
    "activities": [
        {
            "_id": "5c716d5a80842f2c1f861d82",
            "name": "Cheese Pizza",
            "sku": {
                "_id": "5c6f8489ebd992042fa91c3b",
                "name": "Cheese Pizza",
                "number": 12347,
                "case_number": "190989928447",
                "unit_number": "909899284471",
                "unit_size": "1 count",
                "count_per_case": 20,
                "product_line": "5c6f831aebd992042fa91c38",
                "comment": "",
                "formula": {
                    "_id": "5c6f8250ebd992042fa91c35",
                    "name": "Pizza Veg",
                    "number": 1001,
                    "ingredients_list": [
                        {
                            "quantity": "2 count",
                            "_id": {
                                "_id": "5c6db99def0a93f16f030489",
                                "name": "Tomatoes",
                                "number": 117,
                                "vendor_info": "Red Nation",
                                "package_size": "5 count",
                                "cost_per_package": 5.24,
                                "comment": "",
                                "__v": 0
                            }
                        },
                        {
                            "quantity": "2.1 oz.",
                            "_id": {
                                "_id": "5c6f80744e943e03e9b28344",
                                "name": "Mozzarella",
                                "number": 888897,
                                "vendor_info": "Krafts",
                                "package_size": "15 oz.",
                                "cost_per_package": 5.17,
                                "comment": "",
                                "__v": 0
                            }
                        },
                        {
                            "quantity": "5 oz.",
                            "_id": {
                                "_id": "5c6db989ef0a93f16f030471",
                                "name": "Flour",
                                "number": 888893,
                                "vendor_info": "Utah Vendors",
                                "package_size": "70 lb.",
                                "cost_per_package": 100,
                                "comment": "white",
                                "__v": 0
                            }
                        },
                        {
                            "quantity": ".5 oz.",
                            "_id": {
                                "_id": "5c6db99def0a93f16f030480",
                                "name": "Baking Soda",
                                "number": 111,
                                "vendor_info": "Hammer",
                                "package_size": "2 oz.",
                                "cost_per_package": 1.17,
                                "comment": "",
                                "__v": 0
                            }
                        }
                    ],
                    "comment": "veg pizza",
                    "__v": 0
                },
                "formula_scale_factor": 3,
                "manufacturing_lines": [
                    {
                        "_id": "5c70eb83b7219b281f71c802"
                    },
                    {
                        "_id": "5c70eb91b7219b281f71c804"
                    }
                ],
                "manufacturing_rate": 5.7,
                "__v": 0
            },
            "line": "5c70eb83b7219b281f71c802",
            "start": "2019-03-01T05:00:00.000Z",
            "duration": 302.1,
            "__v": 0,
            "actual_duration": 302.1,
            "actual_start": "2019-03-01T05:00:00.000Z",
            "actual_end": "2019-03-13T19:06:00.000Z"
        },
        {
            "_id": "5c716d6180842f2c1f861d83",
            "name": "Chicken Pizza",
            "sku": {
                "_id": "5c6f8489ebd992042fa91c3c",
                "name": "Chicken Pizza",
                "number": 6395,
                "case_number": "098992844719",
                "unit_number": "098992844719",
                "unit_size": "1 plate",
                "count_per_case": 7,
                "product_line": "5c6f8469ebd992042fa91c39",
                "comment": "",
                "formula": {
                    "_id": "5c6f8250ebd992042fa91c37",
                    "name": "Stir Fry",
                    "number": 1003,
                    "ingredients_list": [
                        {
                            "quantity": "20 g",
                            "_id": {
                                "_id": "5c6db989ef0a93f16f03046f",
                                "name": "Soy Sauce",
                                "number": 91,
                                "vendor_info": "Kikoman",
                                "package_size": "8 oz.",
                                "cost_per_package": 3.42,
                                "comment": "asian",
                                "__v": 0
                            }
                        },
                        {
                            "quantity": "10 count",
                            "_id": {
                                "_id": "5c6f8a17b80d6005e6a04e00",
                                "name": "Mangos",
                                "number": 110,
                                "vendor_info": "Thai Garden",
                                "package_size": "1 count",
                                "cost_per_package": 3.5,
                                "comment": "",
                                "__v": 0
                            }
                        },
                        {
                            "quantity": "17 lb.",
                            "_id": {
                                "_id": "5c6db99def0a93f16f030481",
                                "name": "Chicken",
                                "number": 114,
                                "vendor_info": "Chicken Farm",
                                "package_size": "0.5 lb.",
                                "cost_per_package": 10.12,
                                "comment": "",
                                "__v": 0
                            }
                        },
                        {
                            "quantity": "2 gal",
                            "_id": {
                                "_id": "5c6db99def0a93f16f030484",
                                "name": "Canola Oil",
                                "number": 116,
                                "vendor_info": "Cornadsf",
                                "package_size": "20 fl.oz.",
                                "cost_per_package": 8.15,
                                "comment": "",
                                "__v": 0
                            }
                        }
                    ],
                    "comment": "",
                    "__v": 0
                },
                "formula_scale_factor": 2.4,
                "manufacturing_lines": [
                    {
                        "_id": "5c70eb83b7219b281f71c802"
                    },
                    {
                        "_id": "5c70eb91b7219b281f71c804"
                    }
                ],
                "manufacturing_rate": 10,
                "__v": 0
            },
            "line": "5c70eb83b7219b281f71c802",
            "start": "2019-04-01T04:00:00.000Z",
            "duration": 540,
            "__v": 0,
            "actual_duration": 1045,
            "actual_start": "2019-04-01T04:00:00.000Z",
            "actual_end": "2019-04-13T15:00:00.000Z"
        }
    ],
    "ingredients": [
        {
            "ingredient": {
                "_id": "5c6db99def0a93f16f030489",
                "name": "Tomatoes",
                "number": 117,
                "vendor_info": "Red Nation",
                "package_size": "5 count",
                "cost_per_package": 5.24,
                "comment": "",
                "__v": 0
            },
            "quantity": "318 count",
            "packages": 63.6
        },
        {
            "ingredient": {
                "_id": "5c6f80744e943e03e9b28344",
                "name": "Mozzarella",
                "number": 888897,
                "vendor_info": "Krafts",
                "package_size": "15 oz.",
                "cost_per_package": 5.17,
                "comment": "",
                "__v": 0
            },
            "quantity": "333.9 oz",
            "packages": 22.26
        },
        {
            "ingredient": {
                "_id": "5c6db989ef0a93f16f030471",
                "name": "Flour",
                "number": 888893,
                "vendor_info": "Utah Vendors",
                "package_size": "70 lb.",
                "cost_per_package": 100,
                "comment": "white",
                "__v": 0
            },
            "quantity": "49.69 lb",
            "packages": 0.71
        },
        {
            "ingredient": {
                "_id": "5c6db99def0a93f16f030480",
                "name": "Baking Soda",
                "number": 111,
                "vendor_info": "Hammer",
                "package_size": "2 oz.",
                "cost_per_package": 1.17,
                "comment": "",
                "__v": 0
            },
            "quantity": "79.5 oz",
            "packages": 39.75
        },
        {
            "ingredient": {
                "_id": "5c6db989ef0a93f16f03046f",
                "name": "Soy Sauce",
                "number": 91,
                "vendor_info": "Kikoman",
                "package_size": "8 oz.",
                "cost_per_package": 3.42,
                "comment": "asian",
                "__v": 0
            },
            "quantity": "91.43 oz",
            "packages": 11.43
        },
        {
            "ingredient": {
                "_id": "5c6f8a17b80d6005e6a04e00",
                "name": "Mangos",
                "number": 110,
                "vendor_info": "Thai Garden",
                "package_size": "1 count",
                "cost_per_package": 3.5,
                "comment": "",
                "__v": 0
            },
            "quantity": "1296 count",
            "packages": 1296
        },
        {
            "ingredient": {
                "_id": "5c6db99def0a93f16f030481",
                "name": "Chicken",
                "number": 114,
                "vendor_info": "Chicken Farm",
                "package_size": "0.5 lb.",
                "cost_per_package": 10.12,
                "comment": "",
                "__v": 0
            },
            "quantity": "2203.2 lb",
            "packages": 4406.4
        },
        {
            "ingredient": {
                "_id": "5c6db99def0a93f16f030484",
                "name": "Canola Oil",
                "number": 116,
                "vendor_info": "Cornadsf",
                "package_size": "20 fl.oz.",
                "cost_per_package": 8.15,
                "comment": "",
                "__v": 0
            },
            "quantity": "33177.6 floz",
            "packages": 1658.88
        }
    ]
};
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
                          <Table id="sku_toPDF" responsive size="sm">
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
                          <Table id="formula_toPDF" responsive size="sm">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>#</th>
                                <th>Ingredients List</th>
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
                          <Table id="ing_toPDF" responsive size="sm">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Ingr#</th>
                                <th>Vendor Info</th>
                                <th>Package Size</th>
                                <th>Cost Per Package</th>
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
                    <th>Ingredient</th>
                    <th>Quantity</th>
                    <th>Packages</th>
                  </tr>
                </thead>
                <tbody>
                  {report.ingredients.map(({ingredient, quantity, packages}) => (
                    <tr>
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
               <Button onClick={this.exportPDF.bind(report)}>PDF</Button>
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
