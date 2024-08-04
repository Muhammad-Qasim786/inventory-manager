"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
import { Box, Modal, Typography, Stack, TextField, Button, Icons } from "@mui/material";
import { firestore } from "@/firebase";
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from "firebase/firestore";
// SearchRoundedIcon
export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState(" ")
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredItems, setFilteredItems] = useState([])

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }



  const filteredInventory = inventory.filter((item) => {
    return item.name.toLowerCase().includes(searchQuery.toLowerCase)
  });

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      }
      else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  useEffect(() => {
    if (searchQuery) {
      const filtered = inventory.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()));
      setFilteredItems(filtered);
    } else {
      setFilteredItems(inventory);
    }
  }, [searchQuery, inventory])


  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)


  return (

    <Box width="100vw"
      height="100vh"
      display="flex"
      flexDirection={"column"}
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Typography variant="h1">Inventory Manager</Typography>
      <TextField
        variant="filled"
        sx={{ width: 800 }}
        label="Search Inventory"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top='50%'
          left="50%"
          sx={{ transform: "translate(-50%, -50%)", }}
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
        >

          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
            />

            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >Add</Button>
          </Stack>
        </Box>
      </Modal>
      <Button
        variant="contained"
        onClick={() => {
          handleOpen()
        }}
      >
        Add New Item
      </Button>
      

      <Box border={"1px solid #333"}>
        <Box
        
          width={"800px"}
          height={"50px"}
          bgcolor={"#ADD8E6"}
          display="flex"
          alignItems={"center"}
          justifyContent={"space-between"}
          padding={5}


        >
          <Typography variant="h4" color="#333" textAlign={"center"} >
          Name</Typography>

          <Typography variant="h4" color="#333" textAlign={"center"} >
          Quantity</Typography>

          <Typography variant="h4" color="#333" textAlign={"center"} >
          </Typography>
          <Typography variant="h4" color="#333" textAlign={"center"} >
          </Typography>
          
           </Box> 
          <Stack width="800px" height="300px" spacing={2} overflow="auto">
            {filteredItems.map(({ name, quantity }) => (
              <Box key={name} width="100%"
                minHeight={"150px"}
                display="flex"
                alignItems={"center"}
                justifyContent={"space-between"}
                bgcolor={"#f0f0f0"}
                padding={5}
              >
                <Typography variant="h3" color="#333" textAlign={"center"} >
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h3" color="#333" textAlign={"center"} >
                  {quantity}
                </Typography>
                <Stack direction={"row"} spacing={2}>
                  <Button variant="contained" onClick={() => {
                    addItem(name)
                  }}>
                    Add
                  </Button>
                  <Button variant="contained" onClick={() => {
                    removeItem(name)
                  }}>
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
     

  )
}
