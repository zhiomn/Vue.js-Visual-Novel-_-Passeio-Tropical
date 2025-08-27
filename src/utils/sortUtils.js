export function sortContentByReadStatus(contentArray, readIdsArray, sortKey) {
  const readIdsSet = new Set(readIdsArray);

  const unreadItems = [];
  const readItems = [];

  contentArray.forEach(item => {
    // A thread is UNREAD if at least one of its messages has an ID that is NOT in the readIdsSet.
    const isUnread = item.messages.some(message => !readIdsSet.has(message.id));

    if (isUnread) {
      unreadItems.push(item);
    } else {
      readItems.push(item);
    }
  });
  
  readItems.sort((a, b) => a[sortKey].localeCompare(b[sortKey]));

  return [...unreadItems, ...readItems];
}
