import React, {  useContext, useEffect, useState } from 'react';
import Modal from 'react-modal'; // Import react-modal
import ReactSwitch from 'react-switch';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CrashType } from '../setCrashContext';
const CrashList = () => {
  // Sample data for the clickable blocks
  const [ischecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const {crashes} = useContext(CrashType);    
  const [criticalCrash,setCriticalCrash]= useState(crashes[0]);
  const [warningCrash,setWarningCrash] = useState(crashes[1]);
  const [fatalCrash,setFatalCrash] = useState(crashes[2]);
  const total_crashes = [];
    // State to manage the selected block
    const [selectedBlock, setSelectedBlock] = useState(null);

    // State to manage the selected error class
    const [selectedErrorClass, setSelectedErrorClass] = useState("CRITICAL");
  total_crashes["CRITICAL"] = criticalCrash;
  total_crashes["WARNING"] =warningCrash;
  total_crashes["FATAL"]= fatalCrash;
  console.log(warningCrash);
  useEffect(()=>{
    console.log("UseEffect Fired");
  },[criticalCrash,warningCrash,fatalCrash,crashes]);
  const partition_str = String.raw`C:${"\\"}`;
  console.log(partition_str);
  console.log("Light mode:",isLightMode);
  function displayCPUPerc(num_list){
    let res_str = "";
    for (let i in num_list){
      if (i !== num_list.length-1)
        res_str = res_str +", "+parseFloat(num_list[i]);
      else{
        res_str += parseFloat(num_list[i])+"\n";
      }
    }
    return res_str;
  }
  const notifyMessage = (message, success = false) => {
    if (!success) {
      toast.error(message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 650
      });

    }
    else {
      toast.success(message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 650
      })
    }
  }

  function updateCrashes(crashToRemove) {
    if (crashToRemove.Class === "CRITICAL") {
      let temp_critical_crash = criticalCrash.filter(
        (crash_block) => crash_block.fname !== crashToRemove.fname
      );
      setCriticalCrash(temp_critical_crash);
    }
    if (crashToRemove.Class === "FATAL") {
      let temp_fatal_crash = fatalCrash.filter(
        (crash_block) => crash_block.fname !== crashToRemove.fname
      );
      setFatalCrash(temp_fatal_crash);
    }
    if (crashToRemove.Class === "WARNING") {
      let temp_warning_crash = warningCrash.filter(
        (crash_block) => crash_block.fname !== crashToRemove.fname
      );
      setWarningCrash(temp_warning_crash);
    }
  }
  
  const openConfirmationModal = () => {
    setIsConfirmationModalOpen(true);
  };
  const closeConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
  };





  // Function to handle block selection
  const handleBlockClick = (block) => {
    setSelectedBlock(block);
  };

  // Function to handle error class selection
  const handleClassClick = (errorClass) => {
    setSelectedErrorClass(errorClass);
  };
  const removeData = async (blockToSend) => {
    fetch('http://54.242.124.42:8080/api/deleteCrash', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(blockToSend)
    })
      .then((response) => {
        if (response.ok && response.body.deletedCount !== 0) {
          console.log("Success response: ", response);
          return response.json();
        } else {
          console.log("Failed deleting response:", response);
        }
      })
      .catch((error) => {
        // Handle any errors that occur during the request
        console.error(error);
      });
    updateCrashes(blockToSend);
  }
  const handleCheckBox = () => {
    setIsChecked(true);
    const blockToSend = selectedBlock;
    setLoading(true);

    const handleSuccess = () => {
      setIsChecked(false);
      setLoading(false);
      setSelectedBlock(null);
      notifyMessage("Crash Deleted Successfully: " + blockToSend.fname, true);
    };

    const handleFailure = (error) => {
      setIsChecked(false);
      setLoading(false);
      setSelectedBlock(null);
      notifyMessage("Crash Could not be deleted");
    };

    removeData(blockToSend)
      .then(handleSuccess)
      .catch(handleFailure);
  };

  const handleCheckboxConfirmation = () => {
    closeConfirmationModal(); // Close the confirmation modal
    handleCheckBox(); // Proceed with your checkbox handling logic
  };

  return (

    <div className={`flex max-w-screen-2xl ${isLightMode ? 'text-blue-900': 'text-white'} overflow-y-hidden ${isLightMode === true ? "bg-zinc-100":"bg-violet-950"}`}>
      <ToastContainer />
      {console.log("Initally checked", ischecked)}
      <div className={`flex flex-col w-[35%] h-max p-4 justify-start  ${isLightMode === true ? "bg-zinc-100":"bg-violet-950"}`}>
        {/* 30% width container */}
        <div className=' text-lg w-full'>
          <button
            className={`mb-2 p-2 w-1/3 cursor-pointer ${isLightMode? selectedErrorClass === 'FATAL' ? 'bg-sky-200':'bg-zinc-100' : selectedErrorClass === 'FATAL' ? 'bg-pink-800' : 'bg-gray-700'
              }`}
            onClick={() => handleClassClick('FATAL')}
          >
            Fatal
          </button>
          <button
            className={`mb-2 p-2  w-1/3 cursor-pointer ${isLightMode? selectedErrorClass === 'CRITICAL' ? 'bg-sky-200':'bg-zinc-100' : selectedErrorClass === 'CRITICAL' ? 'bg-pink-800' : 'bg-gray-700'
          }`}
            onClick={() => handleClassClick('CRITICAL')}
          >
            Critical
          </button>
          <button
            className={`mb-2 p-2 w-1/3 cursor-pointer ${isLightMode? selectedErrorClass === 'WARNING' ? 'bg-sky-200':'bg-zinc-100' : selectedErrorClass === 'WARNING' ? 'bg-pink-800' : 'bg-gray-700'
          }`}
            onClick={() => handleClassClick('WARNING')}
          >
            Warning
          </button>
        </div>
        <div className="flex flex-col gap-9">
          <ul className=' w-full overflow-y-auto h-screen overflow-x-visible'>
            {selectedErrorClass &&
              total_crashes[selectedErrorClass]
.map((block) =>(
                  <li
                    key={block._id}
                    className="mb-2"
                    onClick={() => handleBlockClick(block)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={` w-full bg-clip-border mr-4 pl-2 pr-6 pt-5 pb-5 shadow ${isLightMode? 'hover:shadow-md':'hover:shadow-md'} ${isLightMode? '':'hover:shadow-gray-700'} ${isLightMode? 'bg-gray-200':'bg-gray-700'}`}>
                      <h2 className="text-sm font-semibold md:text-lg">{block.fname.split(".")[0]}</h2>
                      <p className={`text-sm ${isLightMode? 'text-blue-900':'text-gray-300'}`}>{block.tstamp.slice(0,4)+"/"+block.tstamp.slice(4,6)+"/"+block.tstamp.slice(6,8)}</p>

                    </div>
                  </li>
                ))}

          </ul>
        </div>

      </div>

      {/* 70% width container */}
      <div className=" flex flex-col w-2/3  p-4 my-4 bg-cover">


        {selectedBlock && (
          <>
            <div className="flex items-start justify-start top-3 right-0 gap-5">
              <input id="green-checkbox" type="checkbox" value="" className=" w-8 h-8 rounded-xl accent-green-500 sticky" checked={ischecked} onChange={openConfirmationModal} />
              <p className='text-2xl text-center'>Resolved</p>
            </div>
            <div className='flex flex-col items-center mt-6'>

              <h1 className="text-2xl text-center font-semibold mb-2">{selectedBlock.fname}</h1>
              <div className={`flex flex-col items-start text-xl ${isLightMode? 'text-blue-900':'text-gray-300'} mt-5 ml-6`}>
                <p className=' text-left'>System: {selectedBlock.System}</p>
                <p className='text-left'>Node: {selectedBlock.Node}</p>
                <p className=' text-left'>Version: {selectedBlock.Version}</p>
                <p className='text-left'>Machine: {selectedBlock.Machine}</p>
                <p className='text-left'>Processor: {selectedBlock.Processor}</p>
                <p className='text-left'>RAM Usage: {selectedBlock["RAM Usage"]+" %"}</p>
                <p className='text-left'>Network Information</p>
                <p className='text-left ml-5'>{"--"}Bytes Sent: {selectedBlock["Network_det"]["Bytes_sent"]}</p>
                <p className='text-left ml-5'>{"--"}Bytes Received: {selectedBlock["Network_det"]["Bytes_rec"]}</p>
                <p className='text-left ml-5'>{"--"}Package Sent: {selectedBlock["Network_det"]["Pack_sent"]}</p>
                <p className='text-left ml-5'>{"-0"}Package Received: {selectedBlock["Network_det"]["Pack_rec"]}</p>
                <p className='text-left'>Windows Version and Edition: {selectedBlock["Win_ver"][0]+" "+selectedBlock["Win_ver"][1]+" "+selectedBlock["Win_ver"][2]+" "+selectedBlock["Win_ver"][3]}</p>
                <p className='text-left'>CPU Percentage: {displayCPUPerc(selectedBlock["CPU_Perc"])}</p>
                <p className='text-left'>Partition Info</p>
                <p className='text-left ml-5'>{"--"}Mount Point: {selectedBlock["Partitions"][partition_str]["Mountpt"]}</p>
                <p className='text-left ml-5'>{"--"}Total: {selectedBlock["Partitions"][partition_str]["Tot"]}</p>
                <p className='text-left ml-5'>{"--"}Used: {selectedBlock["Partitions"][partition_str]["Used"]}</p>
                <p className='text-left ml-5'>{"--"}Free: {selectedBlock["Partitions"][partition_str]["Free"]}</p>
                <p className='text-left'>Swap Information</p>
                 <p className='text-left ml-5'>{"--"}Swap Total: {selectedBlock["Swap Total"]["Swap Total"]}</p>
                <p className='text-left ml-5'>{"--"}Swap Used: {selectedBlock["Swap Total"]["Swap Used"]}</p>
                <p className='text-left ml-5'>{"--"}Swap Usage: {selectedBlock["Swap Total"]["Swap Usage"]}</p>
                <p className= {`text-left border-b-2 border-t-2 border-l-2 border-r-2 border-dotted ${isLightMode? ' border-blue-600': 'border-cyan-300' } pt-4 pb-4 pl-2 pr-2`}>{selectedBlock["Error body"]}</p>
                <br></br>
              </div>
              {loading && (
                <p className='w-full bg-orange-600 py-10 text-center text-2xl mt-6'>Loading...</p>
              )}
            </div>
            <Modal
              isOpen={isConfirmationModalOpen}
              contentLabel="Confirm Checkbox"
              onRequestClose={closeConfirmationModal}
              className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded p-4 w-1/2 max-w-md'
              overlayClassName=' fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center'
            >
              <h2 className="text-2xl mb-4 text-center">Confirm Checkbox</h2>
              <p className="text-gray-700 mb-4 text-center">Are you sure you want to proceed?</p>
              <div className='flex items-center justify-center'>
                <button
                  className="bg-green-500 text-white py-2 px-4 rounded mr-4"
                  onClick={handleCheckboxConfirmation}
                >
                  Confirm
                </button>
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded"
                  onClick={closeConfirmationModal}
                >
                  Cancel
                </button>
              </div>
            </Modal>

          </>


        )}

      </div>
      <ReactSwitch checkedIcon={
              <div>
              <img src={require('../assets/dark_mode.png')} alt='Dark mode' style={{
                width: '32px', height: 'auto'
              }}/>
            </div>
      } uncheckedIcon={
        <div style={{
          display:'flex',
          alignItems:'flex-end'
        }}>
          <img src={require("../assets/bright_mode.png")} alt='Light mODE' style={{
            width: '25px', height: 'auto', marginLeft:3,
          }}/>
        </div>
      } onChange={() => { setIsLightMode(!isLightMode) }} checked={isLightMode} width={80} className=' mt-4 mr-6 items-end justify-end sticky ' />

    </div>
  );

};

export default CrashList;