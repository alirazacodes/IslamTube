import React, { useState, useEffect, useRef } from 'react'
import { Sidebar, Header } from '../../layout'
import { BiCloud, BiPlus } from 'react-icons/bi'
import { useAsset, useCreateAsset } from '@livepeer/react'
import { UploadInput, Background } from '../../components'
import { saveToIPFS, getContract } from '../../utils'
import toast from 'react-hot-toast'

export default function Upload() {
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [location, setLocation] = useState<string>('')
  const [thumbnail, setThumbnail] = useState<File>()
  const [uploadData, setUploadData] = useState({})
  const [video, setVideo] = useState<File>()

  const thumbnailRef = useRef<HTMLInputElement>(null)

  const { mutate: createAsset, data: asset, uploadProgress } = useCreateAsset()

  const goBack = () => {
    window.history.back()
  }

  // When a user clicks on the upload button
  const handleSubmit = async () => {
    // Calling the upload video function
    await uploadVideo()
    // Calling the upload thumbnail function and getting the CID
    const thumbnailCID = await uploadThumbnail()
    // Creating a object to store the metadata
    let data = {
      video: asset?.id,
      title,
      description,
      location,
      category,
      thumbnail: thumbnailCID,
      UploadedDate: Date.now().toString(),
    }
    // Calling the saveVideo function and passing the metadata object
    console.log(data)
    await saveVideo(data)
  }

  // Function to upload the video to IPFS
  const uploadThumbnail = async () => {
    // Passing the file to the saveToIPFS function and getting the CID
    const cid = await saveToIPFS(thumbnail)
    // Returning the CID
    return cid
  }

  // Function to upload the video to Livepeer
  const uploadVideo = async () => {
    // Calling the createAsset function from the useCreateAsset hook to upload the video
    createAsset({
      name: title,
      file: video,
    })
  }

  // Function to save the video to the Contract
    const saveVideo = async (data: {
    video: string;
    title: string;
    description: string;
    location: string;
    category: string;
    thumbnail: string;
    UploadedDate: string;
  } = {
    video: "",
    title: "",
    description: "",
    location: "",
    category: "",
    thumbnail: "",
    UploadedDate: "",
  }) => {
    let contract = await getContract();

    await contract.uploadVideo(
      data.video,
      data.title,
      data.description,
      data.location,
      data.category,
      data.thumbnail,
      false,
      data.UploadedDate
    );
  };


  return (
    <Background>
      <p className="text-2xl font-bold text-white">
        {uploadProgress && uploadProgress * 100}
      </p>
      <div className="flex h-screen w-full flex-row">
        <Sidebar updateCategory={undefined} />
        <div className="flex flex-1 flex-col">
          <Header />
          <div className="mt-5 mr-10 flex  justify-end">
            <div className="flex items-center">
              <button
                className="mr-6  rounded-lg border border-gray-600 bg-transparent py-2  px-6  dark:text-[#9CA3AF]"
                onClick={() => {
                  goBack()
                }}
              >
                Discard
              </button>
              <button
                onClick={handleSubmit}
                className="flex flex-row items-center  justify-between  rounded-lg bg-blue-500 py-2 px-4 text-white hover:bg-blue-700"
              >
                <BiCloud />
                <p className="ml-2">Upload</p>
              </button>
            </div>
          </div>
          <div className="m-10 mt-5 flex 	flex-col  lg:flex-row">
            <div className="flex flex-col lg:w-3/4 ">
              <label className="text-sm text-gray-600  dark:text-[#9CA3AF]">
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Video Title"
                className="border-borderWhiteGray mt-2  h-12  w-[90%] rounded-md border bg-transparent p-2 focus:outline-none dark:border-[#444752]  dark:text-white dark:placeholder:text-gray-600"
              />
              <label className="mt-10 text-sm text-gray-600 dark:text-[#9CA3AF]">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Video Description"
                className="border-borderWhiteGray mt-2  h-32 w-[90%] rounded-md  border bg-transparent p-2 focus:outline-none dark:border-[#444752]  dark:text-white dark:placeholder:text-gray-600"
              />

              <div className="mt-10 flex w-[90%] flex-row  justify-between">
                <div className="flex w-2/5 flex-col	">
                  <label className="text-sm text-gray-600  dark:text-[#9CA3AF]">
                    Location
                  </label>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    type="text"
                    placeholder="City - Country"
                    className="border-borderWhiteGray mt-2 h-12 rounded-md  border bg-transparent p-2 focus:outline-none dark:border-[#444752]  dark:text-white dark:placeholder:text-gray-600"
                  />
                </div>
                <div className="flex w-2/5 flex-col	">
                  <label className="text-sm text-gray-600  dark:text-[#9CA3AF]">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className=" border-borderWhiteGray mt-2 h-12  rounded-md border bg-transparent p-2 focus:outline-none dark:border-gray-600  dark:text-white dark:text-[#9CA3AF]"
                  >
                    <option>Naat</option>
                    <option>Hamd</option>
                    <option>Podcasts</option>
                    <option>Islamic News</option>
                    <option>Education</option>
                    <option>Science & Technology</option>
                    <option>Travel</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <label className="mt-10 text-sm  text-gray-600 dark:text-[#9CA3AF]">
                Thumbnail
              </label>

              <div
                onClick={() => {
                  thumbnailRef.current.click()
                }}
                className="border-borderWhiteGray mt-2 flex  h-36 w-64 items-center justify-center rounded-md  border-2 border-dashed p-2 dark:border-gray-600"
              >
                {thumbnail ? (
                  <img
                    onClick={() => {
                      thumbnailRef.current.click()
                    }}
                    src={URL.createObjectURL(thumbnail)}
                    alt="thumbnail"
                    className="h-full rounded-md"
                  />
                ) : (
                  <BiPlus size={40} color="gray" />
                )}
              </div>

              <input
                type="file"
                className="hidden"
                ref={thumbnailRef}
                onChange={(e) => {
                  setThumbnail(e.target.files[0])
                }}
              />
            </div>

            <UploadInput isAudio={false} setVideo={setVideo} />
          </div>
        </div>
      </div>
    </Background>
  )
}
