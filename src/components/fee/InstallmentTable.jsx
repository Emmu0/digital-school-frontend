import React, { useState, useEffect } from "react";
import { Button, Col, Form, Table, Row } from "react-bootstrap";

const InstallmentTable = ({ data,feeDepositHandler }) => {
    console.log('data on installmentTable -->', data);

    const [installments, setInstallments] = useState([]);
    const [checkedMonths, setCheckedMonths] = useState([]);
    const [headsArray, setHeadsArray] = useState([]);

    useEffect(() => {
        setInstallments(data);
    }, [data]);

    useEffect(() => {
        const headsSet = new Set();

        installments.forEach((item, index) => {
            let netpayableAmount = 0;
            let discount_head_id = [];
            let discountedAmount = 0;
            let grossPayableAmount = 0;

            item?.discounts?.forEach((ds) => {
                discount_head_id.push({ id: ds.fee_head_id, percent: ds.percent });
            });

            item?.heads?.forEach((head) => {
                headsSet.add(head.headname);
                let discountRecord = discount_head_id.find((res) => res.id === head.fee_head_master_id);
                if (discountRecord) {
                    discountedAmount += Math.round((parseInt(head.head_amount) * parseInt(discountRecord.percent)) / 100);
                }
            });

            grossPayableAmount += parseInt(item.installment_amount) - discountedAmount;
           netpayableAmount += grossPayableAmount + parseInt(item.transport_fee ?? 0) + parseInt(item.previous_due ?? 0);
            item.net_payable_amount = netpayableAmount;
            item.discounted_amount = discountedAmount;
            item.grossPayableAmount = grossPayableAmount;
            
            if(index === 0){
                item.isdissable = false;
            }
            else{
                console.log("item.isdissable", item.isdissable);
                item.isdissable = item.isdissable === undefined ? true : item.isdissable;
            }
        });

        let dissable = installments?.filter((vl) => vl?.status !== "completed")[0]
        console.log("totalFees ==> updated", installments?.filter((vl) => vl?.status !== "completed"));

        console.log('dissable-->', dissable);
        if (dissable) {
          dissable.isdissable = false
        }


        headsSet.add("Total Amount");
        headsSet.add("Transport Fee");
        headsSet.add("Deposited Amount");
        headsSet.add("Discount");
        headsSet.add("Late Fee");
        headsSet.add("Previous Due");
        headsSet.add("Net Payable Amount");

        setHeadsArray(Array.from(headsSet));
    }, [installments]);

    const getFee = (item, headName, headFee) => {
        switch (headName) {
            case "Transport Fee":
                return item.transport_fee;
            case "Previous Due":
                return item?.previous_due ?? 0;
            case "Deposited Amount":
                return item?.deposited_amount ?? 0;
            case "Net Payable Amount":
                return item?.net_payable_amount ?? 0;
            case "Discount":
                return item?.discounted_amount ?? 0;
            case "Total Amount":
                return item.installment_amount;
            default:
                return headFee;
        }
    };

    const handleChange = (e, month, index) => {
        const { checked } = e.target;
      
        setInstallments((prevInstallments) =>{
            const updatedInstallments = [...prevInstallments];
            const selectedInstallments = [];
            updatedInstallments[index].isCheked = checked;

            console.log('updatedInstallments[index]-->',updatedInstallments[index]);
            if(checked){
                if (index + 1 < updatedInstallments.length) {
                    updatedInstallments[index+1].isdissable = false;
                }
            }else{
                for(var i=index+1; i<updatedInstallments.length; i++){
                    updatedInstallments[i].isCheked = checked;
                    updatedInstallments[i].isdissable = true;
                }
            }

            selectedInstallments.push(updatedInstallments.filter((res)=>res.isCheked === true));
            console.log('selectedInstallments-->',selectedInstallments);
            feeDepositHandler(selectedInstallments[0])
            return updatedInstallments;
        });
    };

    return (
        <Row>
            <Table striped bordered hover id="myTable" className="mx-3">
                <thead>
                    <tr>
                        <th
                            style={{
                                width: "140px",
                                maxWidth: "140px",
                                whiteSpace: "nowrap",
                                backgroundColor: "#637384",
                                color: "white",
                                textAlign: "center",
                            }}
                        >
                            Heads
                        </th>
                        {installments.map((item, index) => (
                            <th
                                style={{
                                    width: "140px",
                                    maxWidth: "140px",
                                    whiteSpace: "nowrap",
                                    backgroundColor: "#637384",
                                    color: "white",
                                    textAlign: "center",
                                }}
                                key={item.id}
                            >
                                {item.month}
                                <Form>
                                    <Form.Check
                                        inline
                                        type="checkbox"
                                        name={"checkedMonth"}
                                        
                                        //checked={item?.status === 'completed' || checkedMonths.some((res) => res?.month === item?.month)}
                                        checked={item?.status === 'completed' || item?.isCheked}
                                        onChange={(e) => handleChange(e, item.month, index)}
                                        disabled={item?.status === "completed" || item?.isdissable}
                                    />
                                </Form>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {headsArray.map((headName) => (
                        <tr key={headName}>
                            <td>{headName}</td>
                            {installments.map((item) => {
                                const head = item.heads.find((h) => h.headname === headName);
                                const headFee = head ? head.head_amount : 0;
                                return <td key={item.id}>{getFee(item, headName, headFee)}</td>;
                            })}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Row>
    );
};

export default InstallmentTable;
